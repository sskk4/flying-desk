package com.seba.office_service.service;

import com.seba.office_service.cloud.PhotoService;
import com.seba.office_service.dto.DeskDTO;
import com.seba.office_service.dto.PhotoDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.model.Building;
import com.seba.office_service.model.Desk;
import com.seba.office_service.repository.BuildingRepository;
import com.seba.office_service.repository.DeskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Service odpowiedzialny za logikę biznesową dotyczącą biurek.
 * Obsługuje operacje tworzenia, pobierania, aktualizacji oraz zarządzania zdjęciami powiązanymi z biurkami.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DeskService {

    private final DeskRepository deskRepository;
    private final BuildingRepository buildingRepository;
    private final PhotoService photoService;

    private static final int MAX_FILES_ALLOWED = 5; // Maksymalna liczba plików
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Maksymalny rozmiar pliku (5 MB)

    /**
     * Pobiera biurka z możliwością opcjonalnego filtrowania według statusu zatwierdzenia oraz paginacji.
     *
     * @param isApproved Opcjonalny status zatwierdzenia (true/false). Jeśli null, zwraca wszystkie biurka.
     * @param pageable   Parametry paginacji i sortowania.
     * @return Strona z biurkami spełniającymi warunki filtrowania.
     */
    public Page<Desk> getDesksByApprovalStatus(Boolean isApproved, Pageable pageable) {
        if (isApproved == null) {
            log.info("Fetching all desks without filtering approval status");
            return deskRepository.findAll(pageable);
        } else {
            log.info("Fetching desks with approval status: {}", isApproved);
            return deskRepository.findByIsApproved(isApproved, pageable);
        }
    }

    /**
     * Pobiera wszystkie biurka z możliwością paginacji i sortowania.
     *
     * @param pageable Parametry paginacji i sortowania.
     * @return Strona ze wszystkimi biurkami.
     */
    public Page<Desk> getAllDesks(Pageable pageable) {
        log.info("Fetching all desks with pagination");
        return deskRepository.findAll(pageable);
    }

    /**
     * Pobiera szczegóły biurka oraz powiązanych z nim zdjęć na podstawie jego ID.
     *
     * @param deskId ID biurka.
     * @return Szczegóły biurka z listą zdjęć.
     * @throws ResourceNotFoundException Jeśli biurko o podanym ID nie istnieje.
     */
    public Desk getDeskByIdWithPhotos(Long deskId) {
        Desk desk = deskRepository.findById(deskId)
                .orElseThrow(() -> new ResourceNotFoundException("Desk not found with ID: " + deskId));

        List<PhotoDTO> photos = photoService.getPhotos("DESK", deskId);
        desk.setPhotos(photos);

        log.info("Fetched details for desk ID: {}", deskId);
        return desk;
    }

    /**
     * Tworzy nowe biurko i zapisuje powiązane zdjęcia (jeśli dostarczono).
     *
     * @param deskDTO    Szczegóły nowego biurka.
     * @param buildingId ID budynku, do którego przypisane jest biurko.
     * @param files      Lista zdjęć do powiązania z tworzonym biurkiem.
     * @return Zapisane biurko.
     * @throws IOException W przypadku problemów z zapisem zdjęć.
     * @throws ResourceNotFoundException Jeśli budynek o podanym ID nie istnieje.
     */
    public Desk createDesk(DeskDTO deskDTO, Long buildingId, List<MultipartFile> files) throws IOException {
        validateFiles(files);

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found with ID: " + buildingId));

        Desk desk = buildDeskEntity(deskDTO, building);
        Desk savedDesk = deskRepository.save(desk);

        if (files != null && !files.isEmpty()) {
            savePhotosForDesk(files, savedDesk.getId());
        }

        log.info("Desk created with ID: {}", savedDesk.getId());
        return savedDesk;
    }

    /**
     * Aktualizuje status zatwierdzenia biurka.
     *
     * @param deskId     ID biurka do aktualizacji.
     * @param isApproved Nowy status zatwierdzenia biurka (true/false).
     * @return Zaktualizowane biurko.
     * @throws ResourceNotFoundException Jeśli biurko o podanym ID nie istnieje.
     */
    public Desk updateDeskApprovalStatus(Long deskId, Boolean isApproved) {
        Desk desk = deskRepository.findById(deskId)
                .orElseThrow(() -> new ResourceNotFoundException("Desk not found with ID: " + deskId));

        desk.setIsApproved(isApproved);
        deskRepository.save(desk);

        log.info("Desk with ID: {} approval status updated to: {}", deskId, isApproved);
        return desk;
    }

    /**
     * Zapisuje zdjęcia powiązane z biurkiem w systemie.
     *
     * @param files  Lista zdjęć do zapisania.
     * @param deskId ID biurka powiązanego ze zdjęciami.
     * @throws IOException W przypadku problemów z zapisem zdjęć.
     */
    private void savePhotosForDesk(List<MultipartFile> files, Long deskId) throws IOException {
        for (MultipartFile file : files) {
            String uniqueFileName = UUID.randomUUID().toString() +
                    file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));

            photoService.addPhoto(
                    file.getBytes(),
                    "desks",
                    uniqueFileName,
                    "DESK",
                    deskId
            );

            log.info("Photo uploaded and associated with desk ID: {}", deskId);
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
     * Tworzy encję biurka na podstawie DTO i przypisanego budynku.
     *
     * @param deskDTO Szczegóły biurka w DTO.
     * @param building Budynek przypisany do biurka.
     * @return Utworzona encja biurka.
     */
    private Desk buildDeskEntity(DeskDTO deskDTO, Building building) {
        Desk desk = new Desk();
        desk.setDesk(deskDTO.getDesk());
        desk.setEquipment(Desk.Equipment.valueOf(deskDTO.getEquipment()));
        desk.setDescription(deskDTO.getDescription());
        desk.setPrice(deskDTO.getPrice());
        desk.setStatus(Desk.Status.valueOf(deskDTO.getStatus().toUpperCase()));
        desk.setBuilding(building);
        desk.setIsApproved(false);
        return desk;
    }
}