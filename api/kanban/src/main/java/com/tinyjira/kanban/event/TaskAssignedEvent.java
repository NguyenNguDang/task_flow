package com.tinyjira.kanban.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaskAssignedEvent {
    private String taskTitle;
    private String assigneeEmail;
    private String assignerName;
    private Long taskId;
}
