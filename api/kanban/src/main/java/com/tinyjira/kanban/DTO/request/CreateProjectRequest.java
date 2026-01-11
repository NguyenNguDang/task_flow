package com.tinyjira.kanban.DTO.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Project name must be not blank!")
    private String name;
    
    private String description;
    
    @NotNull(message = "Deadline must be not null")
    @Future(message = "Deadline must be in the future")
    private LocalDate endDate;
}
