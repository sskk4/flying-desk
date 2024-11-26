package com.seba.office_service.cloud;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GoogleCloudStorageCDNService implements CDNService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleCloudStorageCDNService.class);

    private final Storage storage;
    private final String bucketName;

    public GoogleCloudStorageCDNService(@Value("${gcp.bucket.name}") String bucketName) {
        this.storage = StorageOptions.getDefaultInstance().getService();
        this.bucketName = bucketName;
    }

    @Override
    public String uploadFile(byte[] fileBytes, String folderName, String fileName) throws IOException {
        logger.debug("Uploading file: {}/{} to bucket: {}", folderName, fileName, bucketName);
        BlobId blobId = BlobId.of(bucketName, folderName + "/" + fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, fileBytes);
        logger.debug("File uploaded: {}/{} to bucket: {}", folderName, fileName, bucketName);

        return getFileUrl(folderName, fileName);
    }

    @Override
    public String getFileUrl(String folderName, String fileName) {
        String fileUrl = String.format("https://storage.googleapis.com/%s/%s/%s", bucketName, folderName, fileName);
        logger.debug("Generated URL for file: {}/{} - {}", folderName, fileName, fileUrl);
        return fileUrl;
    }

    @Override
    public void deleteFile(String folderName, String fileName) {
        logger.debug("Deleting file: {}/{} from bucket: {}", folderName, fileName, bucketName);
        BlobId blobId = BlobId.of(bucketName, folderName + "/" + fileName);
        boolean deleted = storage.delete(blobId);
        if (deleted) {
            logger.debug("File deleted: {}/{} from bucket: {}", folderName, fileName, bucketName);
        } else {
            logger.error("Failed to delete file: {}/{} from bucket: {}", folderName, fileName, bucketName);
            throw new RuntimeException("Failed to delete file: " + folderName + "/" + fileName);
        }
    }
}



