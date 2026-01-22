package com.tinyjira.kanban.DTO.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProjectSummaryResponse {
    private SummaryStatsDto stats;
    private List<ChartDataDto> statusOverview;
    private List<ChartDataDto> priorityBreakdown;
    private List<ActivityDto> recentActivities;
    private List<WorkloadDto> workload;
    private List<ChartDataDto> typeBreakdown;

    @Data
    @Builder
    public static class SummaryStatsDto {
        private long doneLast7Days;
        private long updatedLast7Days;
        private long createdLast7Days;
        private long dueNext7Days;
    }

    @Data
    @Builder
    public static class ChartDataDto {
        private String label;
        private long value;
        private String color; // Optional, can be handled in FE
    }

    @Data
    @Builder
    public static class ActivityDto {
        private Long id;
        private String user;
        private String userAvatar;
        private String action;
        private String issue;
        private String time; // e.g., "2 hours ago" or ISO string
    }

    @Data
    @Builder
    public static class WorkloadDto {
        private String name;
        private String avatarUrl;
        private long taskCount;
        private int percentage;
        private boolean isUnassigned;
    }
}
