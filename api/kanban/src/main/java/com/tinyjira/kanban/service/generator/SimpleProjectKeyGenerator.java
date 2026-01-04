package com.tinyjira.kanban.service.generator;

import org.springframework.stereotype.Component;

@Component
public class SimpleProjectKeyGenerator implements ProjectKeyGenerator{
    @Override
    public String generate(String projectName) {
        // "Tiny Jira" -> "TJ"
        if (projectName == null || projectName.isEmpty()) return "PRJ";
        String cleanName = projectName.replaceAll("[^a-zA-Z0-9 ]", "").toUpperCase();
        String[] parts = cleanName.split("\\s+");
        StringBuilder key = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) key.append(part.charAt(0));
        }
        
        return !key.isEmpty() ? key.toString() : "PRJ";
    }
}
