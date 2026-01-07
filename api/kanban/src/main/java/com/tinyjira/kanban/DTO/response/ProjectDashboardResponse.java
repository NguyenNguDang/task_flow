package com.tinyjira.kanban.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProjectDashboardResponse {
    private Long projectId;
    private Long totalTasks;
    private List<ChartItem> pieChartData;
    
    @Data
    @AllArgsConstructor
    public static class ChartItem {
        private String label;
        private Long value;
        private String color;
    }
}