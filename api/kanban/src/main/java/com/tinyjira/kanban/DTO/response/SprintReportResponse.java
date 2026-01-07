package com.tinyjira.kanban.DTO.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SprintReportResponse {
    private Long sprintId;
    private String sprintName;
    
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    
    private ProjectDetailResponse.UserSummaryDto mvpUser;
}
