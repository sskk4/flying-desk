package com.seba.office_service.cloud;

import com.seba.office_service.dto.PhotoDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/photos")
public class PhotoController {

    private static final Logger logger = LoggerFactory.getLogger(PhotoController.class);

    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    /**
     * Przesyłanie maksymalnie 5 zdjęć dla konkretnego bytu (desk, building, room, submission).
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhotos(
            @RequestParam("files") List<MultipartFile> files, // Lista plików
            @RequestParam("type") String photoType,          // Typ obiektu (np. SUBMISSION)
            @RequestParam("relatedId") Long relatedId        // Powiązane ID obiektu
    ) {
        logger.info("Received request to upload {} photos for {} with ID: {}", files.size(), photoType, relatedId);

        if (files.size() > 5) {
            return ResponseEntity.badRequest().body("You can upload a maximum of 5 photos.");
        }

        try {
            String folderName = photoType.toLowerCase(); // Folder oparty na typie zdjęcia

            // Prześlij każde zdjęcie
            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();

                photoService.addPhoto(file.getBytes(), folderName, fileName, photoType, relatedId);
                logger.info("Photo uploaded successfully: {}", fileName);
            }

            return ResponseEntity.ok("All photos uploaded and saved successfully.");
        } catch (IOException e) {
            logger.error("Error while uploading photos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload photos: " + e.getMessage());
        }
    }


    /**
     * Pobieranie URL zdjęć powiązanych z danym bytem.
     */
    @GetMapping
    public ResponseEntity<List<PhotoDTO>> getPhotos(
            @RequestParam("type") String photoType,
            @RequestParam("relatedId") Long relatedId
    ) {
        logger.info("Received request to list photos for {} with ID: {}", photoType, relatedId);

        try {
            List<PhotoDTO> photos = photoService.getPhotos(photoType, relatedId);
            logger.info("Returning list of photos for {} with ID: {}", photoType, relatedId);
            return ResponseEntity.ok(photos);
        } catch (Exception e) {
            logger.error("Error while listing photos for {} with ID: {}", photoType, relatedId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Usuwanie zdjęcia powiązanego z ID.
     */
    @DeleteMapping("/{photoId}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long photoId) {
        logger.info("Received request to delete photo with ID: {}", photoId);

        try {
            photoService.deletePhoto(photoId); // Usuwanie zdjęcia
            logger.info("Photo deleted successfully: {}", photoId);
            return ResponseEntity.ok("Photo deleted successfully.");
        } catch (Exception e) {
            logger.error("Error while deleting photo with ID: {}", photoId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete photo: " + e.getMessage());
        }
    }
}