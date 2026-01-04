package com.tinyjira.kanban.service.strategy;


public class LocalStorageStrategy implements FileStorageStrategy {
    @Override
    public String save(byte[] data, String fileName) {
        System.out.println("Saving " + fileName + " to local disk...");
        return "/local/images/" + fileName;
    }
}
