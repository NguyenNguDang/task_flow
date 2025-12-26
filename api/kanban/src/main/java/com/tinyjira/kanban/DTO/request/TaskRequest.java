package com.tinyjira.kanban.DTO.request;

import com.tinyjira.kanban.utils.Priority;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class TaskRequest {
    private String title;
    private String description;
    private Priority priority;
    private Long columnId;
    private Long projectId;
}
