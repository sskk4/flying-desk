package com.seba.office_service.controller;

import com.seba.office_service.dto.DeskDTO;
import com.seba.office_service.model.Desk;
import com.seba.office_service.service.DeskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/building")
public class DeskController {

    private final DeskService deskService;

    /**
     * Tworzy nowe biurko w określonym budynku wraz z powiązanymi zdjęciami.
     *
     * @param deskDTO    Szczegóły biurka
     * @param buildingId ID budynku przekazywane w ścieżce
     * @param files      Lista zdjęć powiązanych z biurkiem
     * @return Zapisane biurko
     * @throws IOException W przypadku błędów podczas przetwarzania plików
     */
    @PostMapping("/{buildingId}/desk")
    @ResponseStatus(HttpStatus.CREATED)
    public Desk createDesk(
            @RequestPart("desk") @Valid DeskDTO deskDTO,
            @PathVariable("buildingId") Long buildingId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        log.info("Creating desk for building ID: {}, with {} files", buildingId, (files != null ? files.size() : 0));
        return deskService.createDesk(deskDTO, buildingId, files);
    }

    /**
     * Pobiera szczegóły biurka na podstawie jego ID.
     *
     * @param deskId ID biurka
     * @return Szczegóły biurka
     */
    @GetMapping("/desk/{deskId}")
    public Desk getDeskById(@PathVariable("deskId") Long deskId) {
        log.info("Fetching desk with ID: {}", deskId);
        return deskService.getDeskByIdWithPhotos(deskId);
    }

    /**
     * Pobiera biurka w określonym budynku z opcjonalnym filtrowaniem według statusu akceptacji.
     *
     * @param buildingId ID budynku
     * @param isApproved Opcjonalny status akceptacji (true/false)
     * @param pageable   Parametry paginacji
     * @return Strona biurek
     */
    @GetMapping("/{buildingId}/desks")
    public Page<Desk> getDesksInBuilding(
            @PathVariable("buildingId") Long buildingId,
            @RequestParam(value = "isApproved", required = false) Boolean isApproved,
            Pageable pageable
    ) {
        log.info("Fetching desks in building ID: {}, with approval status: {}", buildingId, isApproved);
        return deskService.getDesksByBuildingId(buildingId, isApproved, pageable);
    }

    /**
     * Zmienia status akceptacji biurka.
     *
     * @param deskId     ID biurka
     * @param isApproved Nowy status zaakceptowania
     * @return Zaktualizowane biurko
     */
    @PatchMapping("/desk/{deskId}/approve")
    @ResponseStatus(HttpStatus.OK)
    public Desk changeDeskApprovalStatus(
            @PathVariable("deskId") Long deskId,
            @RequestParam("isApproved") Boolean isApproved
    ) {
        log.info("Updating approval status for desk ID: {} to: {}", deskId, isApproved);
        return deskService.updateDeskApprovalStatus(deskId, isApproved);
    }
}
