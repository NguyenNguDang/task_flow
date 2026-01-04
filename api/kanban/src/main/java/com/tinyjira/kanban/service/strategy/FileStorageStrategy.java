package com.tinyjira.kanban.service.strategy;

public interface FileStorageStrategy {
    String save(byte[] data, String fileName);
}
