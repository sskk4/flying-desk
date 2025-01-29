package com.seba.office_service.service;

import com.seba.office_service.cloud.PhotoService;
import com.seba.office_service.dto.PhotoDTO;
import com.seba.office_service.dto.RoomDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.model.Building;
import com.seba.office_service.model.Desk;
import com.seba.office_service.model.Room;
import com.seba.office_service.repository.BuildingRepository;
import com.seba.office_service.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.seba.office_service.utils.RoomSpecification;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Service odpowiedzialny za logikę biznesową dotyczącą pokoi.
 * Obsługuje operacje tworzenia, pobierania, aktualizacji oraz zarządzania zdjęciami powiązanymi z pokojami.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RoomService {

    private final RoomRepository roomRepository;
    private final BuildingRepository buildingRepository;
    private final PhotoService photoService;

    private static final int MAX_FILES_ALLOWED = 5; // Maksymalna liczba plików
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Maksymalny rozmiar pliku (5 MB)



    public Page<Room> getAllRoomsWithFilters(Long buildingId, Boolean isApproved, String name, Pageable pageable) {

        // Tworzymy specyfikację filtrowania
        Specification<Room> specification = Specification
                .where(RoomSpecification.withBuildingId(buildingId))
                .and(RoomSpecification.withApprovalStatus(isApproved))
                .and(RoomSpecification.withNameContaining(name));

        log.info("Fetching all rooms with filters: buildingId={}, isApproved={}, name={}", buildingId, isApproved, name);

        // Pobieramy pokoje z repozytorium
        Page<Room> rooms = roomRepository.findAll(specification, pageable);

        // Dodajemy zdjęcia do każdego pokoju
        rooms.forEach(room -> {
            List<PhotoDTO> photos = photoService.getPhotos("ROOM", room.getId());
            room.setPhotos(photos);
        });

        return rooms;
    }

    /**
     * Pobiera pokoje w określonym budynku z możliwością filtrowania według statusu zatwierdzenia.
     *
     * @param buildingId ID budynku
     * @param isApproved Opcjonalny status akceptacji (true/false)
     * @param pageable   Parametry paginacji
     * @return Strona pokoi
     * @throws ResourceNotFoundException Jeśli budynek o podanym ID nie istnieje
     */
    public Page<Room> getRoomsByBuildingId(Long buildingId, Boolean isApproved, Pageable pageable) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found with ID: " + buildingId));

        if (isApproved == null) {
            log.info("Fetching all rooms for building ID: {}", buildingId);
            return roomRepository.findByBuilding(building, pageable);
        } else {
            log.info("Fetching rooms for building ID: {} with approval status: {}", buildingId, isApproved);
            return roomRepository.findByBuildingAndIsApproved(building, isApproved, pageable);
        }
    }

    /**
     * Pobiera pokoje z możliwością opcjonalnego filtrowania według statusu zatwierdzenia oraz paginacji.
     *
     * @param isApproved Opcjonalny status zatwierdzenia (true/false). Jeśli null, zwraca wszystkie pokoje.
     * @param pageable   Parametry paginacji i sortowania.
     * @return Strona z pokojami spełniającymi warunki filtrowania.
     */
    public Page<Room> getRoomsByApprovalStatus(Boolean isApproved, Pageable pageable) {
        if (isApproved == null) {
            log.info("Fetching all rooms without filtering approval status");
            return roomRepository.findAll(pageable);
        } else {
            log.info("Fetching rooms with approval status: {}", isApproved);
            return roomRepository.findByIsApproved(isApproved, pageable);
        }
    }

    /**
     * Pobiera wszystkie pokoje z możliwością paginacji i sortowania.
     *
     * @param pageable Parametry paginacji i sortowania.
     * @return Strona ze wszystkimi pokojami.
     */
    public Page<Room> getAllRooms(Pageable pageable) {
        log.info("Fetching all rooms with pagination");
        return roomRepository.findAll(pageable);
    }

    /**
     * Pobiera szczegóły pokoju oraz powiązanych z nim zdjęć na podstawie jego ID.
     *
     * @param roomId ID pokoju.
     * @return Szczegóły pokoju z listą zdjęć.
     * @throws ResourceNotFoundException Jeśli pokój o podanym ID nie istnieje.
     */
    public Room getRoomByIdWithPhotos(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        List<PhotoDTO> photos = photoService.getPhotos("ROOM", roomId);
        room.setPhotos(photos);

        log.info("Fetched details for room ID: {}", roomId);
        return room;
    }

    /**
     * Tworzy nowy pokój i zapisuje powiązane zdjęcia (jeśli dostarczono).
     *
     * @param roomDTO    Szczegóły nowego pokoju.
     * @param buildingId ID budynku, do którego przypisany jest pokój.
     * @param files      Lista zdjęć do powiązania z tworzonym pokojem.
     * @return Zapisany pokój.
     * @throws IOException               W przypadku problemów z zapisem zdjęć.
     * @throws ResourceNotFoundException Jeśli budynek o podanym ID nie istnieje.
     */
    public Room createRoom(RoomDTO roomDTO, Long buildingId, List<MultipartFile> files) throws IOException {
        validateFiles(files);

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found with ID: " + buildingId));

        Room room = buildRoomEntity(roomDTO, building);
        Room savedRoom = roomRepository.save(room);

        if (files != null && !files.isEmpty()) {
            savePhotosForRoom(files, savedRoom.getId());
        }

        log.info("Room created with ID: {}", savedRoom.getId());
        return savedRoom;
    }

    /**
     * Aktualizuje status zatwierdzenia pokoju.
     *
     * @param roomId     ID pokoju do aktualizacji.
     * @param isApproved Nowy status zatwierdzenia pokoju (true/false).
     * @return Zaktualizowany pokój.
     * @throws ResourceNotFoundException Jeśli pokój o podanym ID nie istnieje.
     */
    public Room updateRoomApprovalStatus(Long roomId, Boolean isApproved) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        room.setIsApproved(isApproved);
        roomRepository.save(room);

        log.info("Room with ID: {} approval status updated to: {}", roomId, isApproved);
        return room;
    }

    /**
     * Zapisuje zdjęcia powiązane z pokojem w systemie.
     *
     * @param files  Lista zdjęć do zapisania.
     * @param roomId ID pokoju powiązanego ze zdjęciami.
     * @throws IOException W przypadku problemów z zapisem zdjęć.
     */
    private void savePhotosForRoom(List<MultipartFile> files, Long roomId) throws IOException {
        for (MultipartFile file : files) {
            String uniqueFileName = UUID.randomUUID().toString() +
                    file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));

            photoService.addPhoto(
                    file.getBytes(),
                    "rooms",
                    uniqueFileName,
                    "ROOM",
                    roomId
            );

            log.info("Photo uploaded and associated with room ID: {}", roomId);
        }
    }

    /**
     * Waliduje przesłane pliki zdjęć pod kątem liczby, rozmiaru i typu.
     *
     * @param files Lista plików do walidacji.
     * @throws IllegalArgumentException Jeśli pliki nie spełniają wymagań.
     */
    private void validateFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No files provided. Please upload at least one photo.");
        }

        if (files.size() > MAX_FILES_ALLOWED) {
            throw new IllegalArgumentException("You can upload a maximum of " + MAX_FILES_ALLOWED + " photos.");
        }

        for (MultipartFile file : files) {
            if (!file.getContentType().startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed: " + file.getOriginalFilename());
            }
            if (file.getSize() > MAX_FILE_SIZE_BYTES) {
                throw new IllegalArgumentException("File size exceeds the maximum 5MB limit: " + file.getOriginalFilename());
            }
        }
    }

    /**
     * Tworzy encję pokoju na podstawie DTO i przypisanego budynku.
     *
     * @param roomDTO Szczegóły pokoju w DTO.
     * @param building Budynek przypisany do pokoju.
     * @return Utworzona encja pokoju.
     */
    private Room buildRoomEntity(RoomDTO roomDTO, Building building) {
        Room room = new Room();
        room.setRoom(roomDTO.getRoom());
        room.setEquipment(roomDTO.getEquipment());
        room.setDescription(roomDTO.getDescription());
        room.setMaxOccupants(roomDTO.getMaxOccupants());
        room.setPrice(roomDTO.getPrice());
        room.setStatus(Room.Status.valueOf(roomDTO.getStatus().toUpperCase()));
        room.setBuilding(building);
        room.setIsApproved(false); // Domyślny status zatwierdzenia
        return room;
    }
}