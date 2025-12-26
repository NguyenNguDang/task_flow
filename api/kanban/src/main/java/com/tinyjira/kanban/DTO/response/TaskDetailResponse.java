package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TaskDetailResponse {
    private Long id;
    private Long boardColumnId;
    private Long sprintId;
    private String title;
    private String description;
    private TaskStatus status;
    private String assigneeName;
    private String assigneeAvatar;
    private Priority priority;
    private Integer position;
    
}
