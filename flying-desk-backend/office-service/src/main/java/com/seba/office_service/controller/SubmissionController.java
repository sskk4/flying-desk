package com.seba.office_service.controller;

import com.seba.office_service.dto.PhotoDTO;
import com.seba.office_service.dto.SubmissionDTO;
import com.seba.office_service.dto.SubmissionStatusDTO;
import com.seba.office_service.model.Submission;
import com.seba.office_service.service.SubmissionService;
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
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    /**
     * Utwórz nowe zgłoszenie wraz ze zdjęciami.
     *
     * @param submissionDTO DTO reprezentujące szczegóły zgłoszenia
     * @param userId        ID użytkownika przekazywane w nagłówku
     * @param files         Lista zdjęć przesłanych jako część zgłoszenia
     * @return Zapisane zgłoszenie
     * @throws IOException W przypadku problemów z przetwarzaniem plików
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Submission createSubmission(
            @RequestPart("submission") @Valid SubmissionDTO submissionDTO,
            @RequestHeader("X-User-Id") Long userId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        log.info("Received submission for user: {}, with {} files", userId, (files != null ? files.size() : 0));
        return submissionService.createSubmission(submissionDTO, userId, files);
    }

    /**
     * Pobiera wszystkie zgłoszenia w sposób stronicowany.
     *
     * @param pageable Parametry paginacji i sortowania
     * @return Strona zgłoszeń
     */
    @GetMapping
    public Page<Submission> getAllSubmissions(Pageable pageable) {
        log.info("Fetching all submissions with pagination");
        return submissionService.getAllSubmissions(pageable);
    }

    /**
     * Pobiera szczegóły zgłoszenia wraz ze zdjęciami.
     *
     * @param submissionId ID zgłoszenia
     * @return Szczegóły zgłoszenia
     */
    @GetMapping("/{id}")
    public Submission getSubmissionById(@PathVariable("id") Long submissionId) {
        log.info("Fetching details for submission ID: {}", submissionId);
        return submissionService.getSubmissionByIdWithPhotos(submissionId);
    }

    /**
     * Zmienia status zgłoszenia.
     *
     * @param submissionId    ID zgłoszenia
     * @param newStatus       Nowy status zgłoszenia
     * @param rejectionReason Powód odrzucenia (wymagany tylko gdy status = REJECTED)
     * @return Zaktualizowane zgłoszenie
     */
    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public Submission updateSubmissionStatus(
            @PathVariable("id") Long submissionId,
            @RequestParam("status") Submission.Status newStatus,
            @RequestParam(value = "rejectionReason", required = false) String rejectionReason
    ) {
        log.info("Updating submission ID: {} to status: {}", submissionId, newStatus);
        if (newStatus == Submission.Status.REJECTED) {
            log.info("Rejection reason: {}", rejectionReason);
        }
        return submissionService.updateSubmissionStatus(submissionId, newStatus, rejectionReason);
    }

    @GetMapping("/status/{userId}")
    public SubmissionStatusDTO getUserSubmissionStatus(@PathVariable("userId") Long userId) {
        log.info("Fetching submission status for user ID: {}", userId);
        return submissionService.getUserSubmissionStatusWithDetails(userId);
    }
}