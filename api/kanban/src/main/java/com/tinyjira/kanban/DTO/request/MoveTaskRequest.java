package com.tinyjira.kanban.DTO.request;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class MoveTaskRequest {
    @NotNull(message = "Task ID cannot be null")
    private Long taskId;
    
    @NotNull(message = "New Column ID cannot be null")
    private Long newColumnId;
    
    @NotNull(message = "New Index cannot be null")
    @Min(value = 0, message = "Index must be greater than or equal to 0")
    private Integer newIndex;
}
