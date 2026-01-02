package com.tinyjira.kanban.DTO.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;



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
