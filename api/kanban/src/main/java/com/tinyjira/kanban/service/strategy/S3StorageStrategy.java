package com.tinyjira.kanban.service.strategy;

public class S3StorageStrategy implements FileStorageStrategy{
    @Override
    public String save(byte[] data, String fileName) {
        System.out.println("Uploading " + fileName + " to AWS S3...");
        return "https://s3.amazonaws.com/bucket/" + fileName;
    }
}
