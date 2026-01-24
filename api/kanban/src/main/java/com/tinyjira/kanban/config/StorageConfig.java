package com.tinyjira.kanban.config;

import com.tinyjira.kanban.service.strategy.FileStorageStrategy;
import com.tinyjira.kanban.service.strategy.LocalStorageStrategy;
import com.tinyjira.kanban.service.strategy.S3StorageStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {
    @Value("${app.storage.type}")
    private String storageType;
    
    @Bean
    public FileStorageStrategy fileStorageStrategy() {
        if ("s3".equalsIgnoreCase(storageType)) {
            return new S3StorageStrategy();
        }
        return new LocalStorageStrategy();
    }
}
