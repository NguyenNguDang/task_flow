package com.tinyjira.kanban.service.strategy;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageStorageService {
    String upload(Long userId, byte[] data, String fileName) throws IOException;
    void delete(String imageUrl);
}
