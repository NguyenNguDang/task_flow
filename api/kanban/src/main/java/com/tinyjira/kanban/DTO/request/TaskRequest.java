package com.tinyjira.kanban.DTO.request;

import com.tinyjira.kanban.utils.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    @NotBlank(message = "Title must be not blank!")
    private String title;
    
    private String description;
    
    private Priority priority;
    
    @NotNull(message = "Column Id must be not null!")
    private Long columnId;
    
    @NotNull(message = "Project Id must be not null!")
    private Long projectId;
    
    @NotNull(message = "Board Id must be not null!")
    private Long boardId;
    
    // Allow null for backlog tasks
    private Long sprintId;
}
