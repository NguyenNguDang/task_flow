package com.tinyjira.kanban.DTO.request;

import com.tinyjira.kanban.utils.Priority;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TaskRequest {
    private String title;
    private String description;
    private Priority priority;
    private Long columnId;
    private Long projectId;
    private Long boardId;
    private Long sprintId;
}
