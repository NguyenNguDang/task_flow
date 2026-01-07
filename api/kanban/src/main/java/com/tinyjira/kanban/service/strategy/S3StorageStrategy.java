package com.tinyjira.kanban.service.strategy;

import org.springframework.web.multipart.MultipartFile;

public class S3StorageStrategy implements FileStorageStrategy{
    @Override
    public String save(byte[] data, String fileName) {
        System.out.println("Uploading " + fileName + " to AWS S3...");
        return "https://s3.amazonaws.com/bucket/" + fileName;
    }
    
    @Override
    public String store(MultipartFile file) {
        return "";
    }
}
