package com.tinyjira.kanban.service.strategy;


import org.springframework.web.multipart.MultipartFile;

public class LocalStorageStrategy implements FileStorageStrategy {
    @Override
    public String save(byte[] data, String fileName) {
        System.out.println("Saving " + fileName + " to local disk...");
        return "/local/images/" + fileName;
    }
    
    @Override
    public String store(MultipartFile file) {
        return "";
    }
}
