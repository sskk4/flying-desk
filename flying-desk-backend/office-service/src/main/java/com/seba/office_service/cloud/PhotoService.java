package com.seba.office_service.cloud;

import org.springframework.stereotype.Service;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PhotoService {

    private static final Logger logger = LoggerFactory.getLogger(PhotoService.class);
    private final CDNService cdnService;

    // Bazowy URL dla Google Cloud Storage
    private static final String BASE_URL = "https://storage.googleapis.com/office-images/";

    public PhotoService(CDNService cdnService) {
        this.cdnService = cdnService;
    }

    public void uploadPhoto(byte[] fileBytes, String folderName, String fileName) throws IOException {
        logger.debug("Uploading file: {} to folder: {}", fileName, folderName);
        cdnService.uploadFile(fileBytes, folderName, fileName);
        logger.debug("File uploaded successfully: {} to folder: {}", fileName, folderName);
    }

    public String getPhotoUrl(String folderName, String fileName) {
        logger.debug("Fetching URL for file: {}/{}", folderName, fileName);
        String fileUrl = cdnService.getFileUrl(folderName, fileName);
        logger.debug("URL fetched: {}", fileUrl);
        return fileUrl;
    }

    public void deletePhoto(String folderName, String fileName) {
        logger.debug("Deleting file: {}/{}", folderName, fileName);
        cdnService.deleteFile(folderName, fileName);
        logger.debug("File deleted successfully: {}/{}", folderName, fileName);
    }
}

