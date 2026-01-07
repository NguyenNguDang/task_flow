package com.tinyjira.kanban.service.strategy;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageStrategy {
    String save(byte[] data, String fileName);
    String store(MultipartFile file);
}
