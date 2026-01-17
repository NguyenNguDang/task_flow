package com.tinyjira.kanban.service.strategy;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class LocalStorageStrategy implements FileStorageStrategy {
    private final Path rootLocation = Paths.get("media");

    public LocalStorageStrategy() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    @Override
    public String save(byte[] data, String fileName) {
        try {
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path destinationFile = this.rootLocation.resolve(uniqueFileName);
            Files.write(destinationFile, data);
            return "http://localhost:8080/media/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        try {
            return save(file.getBytes(), file.getOriginalFilename());
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
