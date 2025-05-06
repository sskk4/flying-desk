package com.seba.office_service.service;

import com.seba.office_service.cloud.PhotoService;
import com.seba.office_service.dto.PhotoDTO;
import com.seba.office_service.dto.SubmissionDTO;
import com.seba.office_service.exception.errors.ResourceNotFoundException;
import com.seba.office_service.exception.errors.SubmissionValidationException;
import com.seba.office_service.model.Photo;
import com.seba.office_service.model.Submission;
import com.seba.office_service.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final PhotoService photoService;

    private static final int MAX_FILES_ALLOWED = 5; // File limit
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB file size limit

    /**
     * Pobiera wszystkie zgłoszenia w sposób stronicowany.
     *
     * @param pageable Obiekt zarządzający paginacją i sortowaniem
     * @return Stronicowana lista zgłoszeń
     */
    public Page<Submission> getAllSubmissions(Pageable pageable) {
        return submissionRepository.findAll(pageable);
    }


    /**
     * Pobiera szczegółowe informacje o zgłoszeniu wraz z powiązanymi zdjęciami.
     *
     * @param submissionId ID zgłoszenia
     * @return Szczegóły zgłoszenia i zdjęcia
     */
    public Submission getSubmissionByIdWithPhotos(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + submissionId));

        List<PhotoDTO> photos = photoService.getPhotos("SUBMISSION", submissionId);
        submission.setPhotos(photos);
        return submission;
    }

    /**
     * Creates a new submission along with photos.
     *
     * @param submissionDTO Details of the submission
     * @param userId        User ID associated with the submission
     * @param files         List of photos to upload
     * @return Saved submission
     * @throws IOException If file upload fails
     */
    public Submission createSubmission(SubmissionDTO submissionDTO, Long userId, List<MultipartFile> files) throws IOException {
        validateFiles(files);


        Submission submission = buildSubmissionEntity(submissionDTO, userId);
        Submission savedSubmission = submissionRepository.save(submission);


        if (files != null && !files.isEmpty()) {
            savePhotosForSubmission(files, savedSubmission.getId());
        }

        log.info("Submission created with ID: {}", savedSubmission.getId());
        return savedSubmission;
    }

    /**
     * Aktualizuje status zgłoszenia.
     *
     * @param submissionId ID zgłoszenia do aktualizacji
     * @param newStatus Nowy status zgłoszenia
     * @return Zaktualizowane zgłoszenie
     */
    public Submission updateSubmissionStatus(Long submissionId, Submission.Status newStatus) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + submissionId));

        submission.setStatus(newStatus);
        submissionRepository.save(submission);

        log.info("Submission with ID: {} updated to status: {}", submissionId, newStatus);
        return submission;
    }

    /**
     * Save photos associated with a submission.
     *
     * @param files        List of photos to be saved
     * @param submissionId Submission ID for association
     * @throws IOException When photo upload fails
     */
    private void savePhotosForSubmission(List<MultipartFile> files, Long submissionId) throws IOException {
        for (MultipartFile file : files) {

            String uniqueFileName = UUID.randomUUID().toString() +
                    file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));

            photoService.addPhoto(
                    file.getBytes(),                     // File bytes
                    "submissions",                       // Folder name
                    uniqueFileName,                      // File name
                    "SUBMISSION",                        // type of photo
                    submissionId                         // ID of the submission
            );

            log.info("Photo uploaded and associated with submission ID: {}", submissionId);
        }
    }

    /**
     * Build a Submission entity from the Submission DTO and user ID.
     */
    private Submission buildSubmissionEntity(SubmissionDTO submissionDTO, Long userId) {
        Submission submission = new Submission();
        submission.setUserId(userId);
        submission.setFirstName(submissionDTO.getFirstName());
        submission.setLastName(submissionDTO.getLastName());
        submission.setPhone(submissionDTO.getPhone());
        submission.setEmail(submissionDTO.getEmail());
        submission.setCountry(submissionDTO.getCountry());
        submission.setAddress(submissionDTO.getAddress());
        submission.setBuildingName(submissionDTO.getBuildingName());
        submission.setBuildingDescription(submissionDTO.getBuildingDescription());
        submission.setStatus(Submission.Status.PENDING);
        return submission;
    }

    /**
     * Validate files for size, count, and type.
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

    public Submission.Status getUserSubmissionStatus(Long userId) {
        Submission submission = submissionRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No submissions found for user ID: " + userId));
        return submission.getStatus();
    }

}