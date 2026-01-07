package com.tinyjira.kanban.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TaskEstimationUpdatedEvent {
    private Long taskId;
    private Long sprintId;
    private Double newEstimate;
    private Double oldEstimate;
    private LocalDateTime updatedAt;
}