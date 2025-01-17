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
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/desk")
public class DeskController {

    private final DeskService deskService;

    /**
     * Tworzy nowe biurko wraz z powiązanymi zdjęciami.
     *
     * @param deskDTO       Szczegóły biurka
     * @param buildingId ID budynku przekazywane w nagłówku
     * @param files      Lista zdjęć powiązanych z biurkiem
     * @return Zapisane biurko
     * @throws IOException W przypadku błędów podczas przetwarzania plików
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Desk createDesk(
            @RequestPart("desk") @Valid DeskDTO deskDTO,
            @RequestHeader("X-Building-Id") Long buildingId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        log.info("Creating desk for building: {}, with {} files", buildingId, (files != null ? files.size() : 0));
        return deskService.createDesk(deskDTO, buildingId, files);
    }

    /**
     * Pobiera wszystkie biurka z opcjonalnym filtrowaniem według statusu akceptacji.
     *
     * @param isApproved Opcjonalny status akceptacji (true/false)
     * @param pageable   Parametry paginacji
     * @return Strona biurek
     */
    @GetMapping
    public Page<Desk> getAllDesks(
            @RequestParam(value = "isApproved", required = false) Boolean isApproved,
            Pageable pageable
    ) {
        log.info("Fetching desks with approval status: {}", isApproved);
        return deskService.getDesksByApprovalStatus(isApproved, pageable);
    }

    /**
     * Pobiera szczegóły biurka na podstawie jego ID.
     *
     * @param deskId ID biurka
     * @return Szczegóły biurka
     */
    @GetMapping("/{id}")
    public Desk getDeskById(@PathVariable("id") Long deskId) {
        log.info("Fetching desk with ID: {}", deskId);
        return deskService.getDeskByIdWithPhotos(deskId);
    }

    /**
     * Zmienia status akceptacji biurka.
     *
     * @param deskId     ID biurka
     * @param isApproved Nowy status zaakceptowania
     * @return Zaktualizowane biurko
     */
    @PatchMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.OK)
    public Desk changeDeskApprovalStatus(
            @PathVariable("id") Long deskId,
            @RequestParam("isApproved") Boolean isApproved
    ) {
        log.info("Updating approval status for desk ID: {} to: {}", deskId, isApproved);
        return deskService.updateDeskApprovalStatus(deskId, isApproved);
    }
}