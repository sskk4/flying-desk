package com.seba.office_service.cloud;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("folderName") String folderName) {
        logger.info("Received request to upload photo to folder: {}", folderName);

        try {
            photoService.uploadPhoto(file.getBytes(), folderName, file.getOriginalFilename());
            logger.info("Photo uploaded successfully: {}", file.getOriginalFilename());
            return ResponseEntity.ok("Photo uploaded successfully.");
        } catch (IOException e) {
            logger.error("Error while uploading photo: {}", file.getOriginalFilename(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload photo: " + e.getMessage());
        }
    }

    @GetMapping("/{folderName}/{fileName}")
    public ResponseEntity<String> getPhotoUrl(
            @PathVariable String folderName,
            @PathVariable String fileName) {
        logger.info("Received request to get photo URL for file: {}/{}", folderName, fileName);

        try {
            String fileUrl = photoService.getPhotoUrl(folderName, fileName);
            logger.info("Returning URL for file: {}", fileUrl);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            logger.error("Error while retrieving photo URL for file: {}/{}", folderName, fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get photo URL: " + e.getMessage());
        }
    }

    @DeleteMapping("/{folderName}/{fileName}")
    public ResponseEntity<String> deletePhoto(
            @PathVariable String folderName,
            @PathVariable String fileName) {
        logger.info("Received request to delete photo: {}/{}", folderName, fileName);

        try {
            photoService.deletePhoto(folderName, fileName);
            logger.info("Photo deleted successfully: {}/{}", folderName, fileName);
            return ResponseEntity.ok("Photo deleted successfully.");
        } catch (Exception e) {
            logger.error("Error while deleting photo: {}/{}", folderName, fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete photo: " + e.getMessage());
        }
    }
}



