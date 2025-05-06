package com.seba.office_service.controller;

import com.seba.office_service.dto.BuildingDTO;
import com.seba.office_service.model.Building;
import com.seba.office_service.repository.BuildingRepository;
import com.seba.office_service.service.BuildingService;
import com.seba.office_service.utils.BuildingSpecification;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/building")
public class BuildingController {

    private final BuildingService buildingService;

    /**
     * Tworzy nowy budynek wraz ze zdjęciami.
     *
     * @param buildingDTO Szczegóły budynku
     * @param userId      ID użytkownika przekazywane w nagłówku
     * @param files       Lista zdjęć powiązanych z budynkiem
     * @return Zapisany budynek
     * @throws IOException W przypadku błędów podczas przetwarzania plików
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Building createBuilding(
            @RequestPart("building") @Valid BuildingDTO buildingDTO,
            @RequestHeader("X-User-Id") Long userId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        log.info("Creating building for user: {}, with {} files", userId, (files != null ? files.size() : 0));
        return buildingService.createBuilding(buildingDTO, userId, files);
    }



    @GetMapping
    public Page<Building> getBuildings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isApproved,
            @RequestParam(required = false) Building.Status status,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return buildingService.getBuildings(search, isApproved, status, country, city, startDate, endDate, sortBy, sortDir, pageable);
    }


    /**
     * Pobiera szczegóły budynku na podstawie jego ID.
     *
     * @param buildingId ID budynku
     * @return Szczegóły budynku
     */
    @GetMapping("/{id}")
    public Building getBuildingById(@PathVariable("id") Long buildingId) {
        log.info("Fetching building with ID: {}", buildingId);
        return buildingService.getBuildingByIdWithPhotos(buildingId);
    }

    /**
     * Pobiera wszystkie budynki użytkownika na podstawie jego ID.
     *
     * @param userId ID użytkownika przesyłane w nagłówku.
     * @param pageable   Parametry paginacji
     * @return Lista budynków.
     */
    @GetMapping("/user")
    public Page<Building> getBuildingsByUserId(
            @RequestHeader("X-User-Id") Long userId,
            Pageable pageable
    ) {
        log.info("Fetching paginated buildings for user ID: {}", userId);
        return buildingService.getBuildingsByUserId(userId, pageable);
    }


    /**
     * Zmienia status akceptacji budynku.
     *
     * @param buildingId ID budynku
     * @param isApproved Nowy status zaakceptowania
     * @return Zaktualizowany budynek
     */
    @PatchMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.OK)
    public Building changeBuildingApprovalStatus(
            @PathVariable("id") Long buildingId,
            @RequestParam("isApproved") Boolean isApproved
    ) {
        log.info("Updating approval status for building ID: {} to: {}", buildingId, isApproved);
        return buildingService.updateBuildingApprovalStatus(buildingId, isApproved);
    }
}