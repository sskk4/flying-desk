package com.seba.office_service.cloud;

import java.io.IOException;
import java.util.List;

public interface CDNService {
    String uploadFile(byte[] fileBytes, String folderName, String fileName) throws IOException;

    String getFileUrl(String folderName, String fileName);

    void deleteFile(String folderName, String fileName);

    List<String> listFiles(String folderName);
}
