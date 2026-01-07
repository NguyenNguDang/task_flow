package com.tinyjira.kanban.DTO;

import com.tinyjira.kanban.utils.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaskStatusCount {
    private TaskStatus status;
    private Long count;
}