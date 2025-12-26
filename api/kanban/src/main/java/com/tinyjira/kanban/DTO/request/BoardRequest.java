package com.tinyjira.kanban.DTO.request;

import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
public class BoardRequest {
    
    @NotBlank(message = "Project Name must be not null")
    @Size(max = 255, message = "The project name cannot exceed 255 characters")
    private String title;
    
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
}
