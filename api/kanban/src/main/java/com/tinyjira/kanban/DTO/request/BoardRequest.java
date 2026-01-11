package com.tinyjira.kanban.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;


@Getter
public class BoardRequest {
    
    private Long projectId;
    
    @NotBlank(message = "Project Name must be not null")
    @Size(max = 255, message = "The project name cannot exceed 255 characters")
    private String title;
    
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
}
