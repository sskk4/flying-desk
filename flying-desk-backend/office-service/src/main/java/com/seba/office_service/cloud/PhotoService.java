package com.seba.office_service.cloud;

import com.seba.office_service.dto.PhotoDTO;
import com.seba.office_service.model.Photo;
import com.seba.office_service.repository.PhotoRepository;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;



@Service
public class PhotoService {

    private static final Logger logger = LoggerFactory.getLogger(PhotoService.class);
    private final CDNService cdnService;
    private final PhotoRepository photoRepository;

    public PhotoService(CDNService cdnService, PhotoRepository photoRepository) {
        this.cdnService = cdnService;
        this.photoRepository = photoRepository;
    }

    /**
     * Przesyła plik na Google Cloud, zapisuje w tabeli `Photo` i zwraca URL zdjęcia
     */
    public Photo addPhoto(byte[] fileBytes, String folderName, String fileName, String photoType, Long relatedId) {
        try {
            // Upload the file to Google Cloud
            String url = cdnService.uploadFile(fileBytes, folderName, fileName);
            logger.debug("Photo uploaded successfully: {}", url);

            // Create and save the Photo entity
            Photo photo = new Photo();
            photo.setUrl(url);
            photo.setPhotoType(photoType);
            photo.setRelatedId(relatedId);

            return photoRepository.save(photo);
        } catch (IOException e) {
            logger.error("Failed to upload file: {} to folder: {}", fileName, folderName, e);
            throw new RuntimeException("Error occurred during file upload: " + e.getMessage(), e);
        }
    }

    /**
     * Usuwa zdjęcie z chmury i bazy danych.
     */
    public void deletePhoto(Long photoId) {
        // Pobierz zdjęcie z bazy danych
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found with id: " + photoId));

        // Usuwanie z chmury
        String folderName = photo.getPhotoType().toLowerCase() + "s"; // dynamiczna nazwa folderu
        String fileName = extractFileNameFromUrl(photo.getUrl());
        cdnService.deleteFile(folderName, fileName);

        // Usuwanie z bazy danych
        photoRepository.delete(photo);
        logger.debug("Photo deleted successfully: {}", fileName);
    }

    /**
     * Pobiera wszystkie zdjęcia dla danego bytu.
     */
    public List<PhotoDTO> getPhotos(String photoType, Long relatedId) {
        return photoRepository.findByPhotoTypeAndRelatedId(photoType, relatedId).stream()
                .map(photo -> {
                    PhotoDTO dto = new PhotoDTO();
                    dto.setUrl(photo.getUrl());
                    dto.setPhotoType(photo.getPhotoType());
                    dto.setRelatedId(photo.getRelatedId());
                    return dto;
                })
                .toList();
    }

    /**
     * Wydobywa nazwę pliku z URL.
     */
    private String extractFileNameFromUrl(String url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }
}