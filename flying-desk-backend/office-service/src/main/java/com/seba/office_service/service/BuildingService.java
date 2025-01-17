package com.seba.office_service.service;

import com.seba.office_service.cloud.PhotoService;
import com.seba.office_service.dto.BuildingDTO;
import com.seba.office_service.dto.PhotoDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.model.Address;
import com.seba.office_service.model.Building;
import com.seba.office_service.repository.AddressRepository;
import com.seba.office_service.repository.BuildingRepository;
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
 * Service odpowiedzialny za logikę biznesową dotyczącą budynków.
 * Obsługuje operacje tworzenia, pobierania, aktualizacji oraz zarządzania zdjęciami powiązanymi z budynkami.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final PhotoService photoService;
    private final AddressService addressService;

    private static final int MAX_FILES_ALLOWED = 5; // Maksymalna liczba plików
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Maksymalny rozmiar pliku (5 MB)

    /**
     * Pobiera budynki z możliwością opcjonalnego filtrowania według statusu zatwierdzenia oraz paginacji.
     *
     * @param isApproved Opcjonalny status zatwierdzenia (true/false), jeśli null, zwraca wszystkie budynki.
     * @param pageable   Parametry paginacji i sortowania.
     * @return Strona z budynkami spełniającymi warunki filtrowania.
     */
    public Page<Building> getBuildingsByApprovalStatus(Boolean isApproved, Pageable pageable) {
        Page<Building> buildings = (isApproved == null)
                ? buildingRepository.findAll(pageable)
                : buildingRepository.findByIsApproved(isApproved, pageable);

        buildings.forEach(building -> {
            List<PhotoDTO> photos = photoService.getPhotos("BUILDING", building.getId());
            building.setPhotos(photos);
        });

        return buildings;
    }

    /**
     * Pobiera wszystkie budynki z możliwością stronicowania i sortowania.
     *
     * @param pageable Parametry paginacji i sortowania.
     * @return Strona z wszystkimi budynkami.
     */
    public Page<Building> getAllBuildings(Pageable pageable) {
        log.info("Fetching all buildings with pagination");
        return buildingRepository.findAll(pageable);
    }

    /**
     * Pobiera szczegóły budynku oraz powiązanych z nim zdjęć na podstawie jego ID.
     *
     * @param buildingId ID budynku.
     * @return Szczegóły budynku z listą zdjęć.
     * @throws ResourceNotFoundException Jeśli budynek o podanym ID nie istnieje.
     */
    public Building getBuildingByIdWithPhotos(Long buildingId) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found with ID: " + buildingId));

        List<PhotoDTO> photos = photoService.getPhotos("BUILDING", buildingId);
        building.setPhotos(photos);

        log.info("Fetched details for building ID: {}", buildingId);
        return building;
    }

    /**
     * Pobiera wszystkie budynki należące do danego użytkownika.
     *
     * @param pageable Parametry paginacji i sortowania.
     * @param userId ID użytkownika.
     * @return Lista budynków użytkownika.
     */
    public Page<Building> getBuildingsByUserId(Long userId, Pageable pageable) {
        log.info("Fetching paginated buildings for user ID: {}", userId);
        return buildingRepository.findAllByUserId(userId, pageable);
    }


    /**
     * Tworzy nowy budynek i zapisuje powiązane zdjęcia (jeśli dostarczono).
     *
     * @param buildingDTO Szczegóły nowego budynku.
     * @param userId      ID użytkownika tworzącego budynek.
     * @param files       Lista zdjęć do powiązania z tworzonym budynkiem.
     * @return Zapisany budynek.
     * @throws IOException W przypadku problemów z zapisem zdjęć.
     */
    public Building createBuilding(BuildingDTO buildingDTO, Long userId, List<MultipartFile> files) throws IOException {
        validateFiles(files);

        // Tworzenie lub pobieranie adresu
        Address address = addressService.saveAddress(null, buildingDTO.getAddress());

        // Tworzenie obiektu Building
        Building building = buildBuildingEntity(buildingDTO, userId, address);

        // Zapis budynku w bazie danych
        Building savedBuilding = buildingRepository.save(building);

        // Przypisywanie zdjęć, jeśli istnieją
        if (files != null && !files.isEmpty()) {
            savePhotosForBuilding(files, savedBuilding.getId());
        }

        log.info("Building created with ID: {}", savedBuilding.getId());
        return savedBuilding;
    }

    /**
     * Aktualizuje status zatwierdzenia budynku.
     *
     * @param buildingId ID budynku do aktualizacji.
     * @param isApproved Nowy status zatwierdzenia budynku (true/false).
     * @return Zaktualizowany budynek.
     * @throws ResourceNotFoundException Jeśli budynek o podanym ID nie istnieje.
     */
    public Building updateBuildingApprovalStatus(Long buildingId, Boolean isApproved) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found with ID: " + buildingId));

        building.setIsApproved(isApproved);
        buildingRepository.save(building);

        log.info("Building with ID: {} approval status updated to: {}", buildingId, isApproved);
        return building;
    }

    /**
     * Zapisuje zdjęcia powiązane z budynkiem w systemie.
     *
     * @param files      Lista zdjęć do zapisania.
     * @param buildingId ID budynku powiązanego ze zdjęciami.
     * @throws IOException W przypadku problemów z zapisem zdjęć.
     */
    private void savePhotosForBuilding(List<MultipartFile> files, Long buildingId) throws IOException {
        for (MultipartFile file : files) {
            String uniqueFileName = UUID.randomUUID().toString() +
                    file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));

            photoService.addPhoto(
                    file.getBytes(),
                    "buildings",
                    uniqueFileName,
                    "BUILDING",
                    buildingId
            );

            log.info("Photo uploaded and associated with building ID: {}", buildingId);
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
     * Tworzy encję budynku na podstawie DTO, ID użytkownika i adresu.
     *
     * @param buildingDTO DTO zawierające szczegóły budynku.
     * @param userId      ID użytkownika tworzącego budynek.
     * @param address     Adres przypisany do budynku.
     * @return Utworzona encja budynku.
     */
    private Building buildBuildingEntity(BuildingDTO buildingDTO, Long userId, Address address) {
        Building building = new Building();
        building.setUserId(userId);
        building.setBuilding(buildingDTO.getBuilding());
        building.setDescription(buildingDTO.getDescription());
        building.setAddress(address);
        building.setIsApproved(false);
        building.setStatus(Building.Status.ACTIVE);
        return building;
    }
}