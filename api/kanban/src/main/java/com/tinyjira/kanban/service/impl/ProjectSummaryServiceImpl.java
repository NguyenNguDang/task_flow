package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.TaskStatusCount;
import com.tinyjira.kanban.DTO.response.ProjectSummaryResponse;
import com.tinyjira.kanban.model.TaskHistory;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.TaskHistoryRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.ProjectSummaryService;
import com.tinyjira.kanban.utils.Priority;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectSummaryServiceImpl implements ProjectSummaryService {

    private final TaskRepository taskRepository;
    private final TaskHistoryRepository taskHistoryRepository;

    @Override
    @Transactional(readOnly = true)
    public ProjectSummaryResponse getProjectSummary(Long projectId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime sevenDaysLater = now.plusDays(7);

        // 1. Stats
        long doneLast7Days = taskRepository.countDoneTasksSince(projectId, sevenDaysAgo);
        long updatedLast7Days = taskRepository.countUpdatedTasksSince(projectId, sevenDaysAgo);
        long createdLast7Days = taskRepository.countCreatedTasksSince(projectId, sevenDaysAgo);
        long dueNext7Days = taskRepository.countDueSoonTasks(projectId, now, sevenDaysLater);

        ProjectSummaryResponse.SummaryStatsDto stats = ProjectSummaryResponse.SummaryStatsDto.builder()
                .doneLast7Days(doneLast7Days)
                .updatedLast7Days(updatedLast7Days)
                .createdLast7Days(createdLast7Days)
                .dueNext7Days(dueNext7Days)
                .build();

        // 2. Status Overview
        List<TaskStatusCount> statusCounts = taskRepository.countTasksByStatus(projectId);
        List<ProjectSummaryResponse.ChartDataDto> statusOverview = statusCounts.stream()
                .map(sc -> ProjectSummaryResponse.ChartDataDto.builder()
                        .label(sc.getStatus().name())
                        .value(sc.getCount())
                        .color(getStatusColor(sc.getStatus().name()))
                        .build())
                .collect(Collectors.toList());

        // 3. Priority Breakdown
        List<Object[]> priorityCounts = taskRepository.countTasksByPriority(projectId);
        List<ProjectSummaryResponse.ChartDataDto> priorityBreakdown = priorityCounts.stream()
                .map(obj -> {
                    Priority priority = (Priority) obj[0];
                    Long count = (Long) obj[1];
                    return ProjectSummaryResponse.ChartDataDto.builder()
                            .label(priority.name())
                            .value(count)
                            .color(getPriorityColor(priority.name()))
                            .build();
                })
                .collect(Collectors.toList());

        // 4. Recent Activities
        List<TaskHistory> histories = taskHistoryRepository.findRecentActivitiesByProjectId(projectId, PageRequest.of(0, 10));
        List<ProjectSummaryResponse.ActivityDto> recentActivities = histories.stream()
                .map(h -> ProjectSummaryResponse.ActivityDto.builder()
                        .id(h.getId())
                        .user(h.getUser().getName())
                        .userAvatar(h.getUser().getAvatarUrl())
                        .action("changed " + h.getField())
                        .issue(h.getTask().getTitle())
                        .time(formatTimeAgo(h.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());

        // 5. Workload
        List<Object[]> assigneeCounts = taskRepository.countTasksByAssignee(projectId);
        long totalTasks = taskRepository.countTotalTasksByProjectId(projectId);
        
        List<ProjectSummaryResponse.WorkloadDto> workload = assigneeCounts.stream()
                .map(obj -> {
                    User user = (User) obj[0];
                    Long count = (Long) obj[1];
                    int percentage = totalTasks > 0 ? (int) ((count * 100) / totalTasks) : 0;
                    
                    if (user == null) {
                        return ProjectSummaryResponse.WorkloadDto.builder()
                                .name("Unassigned")
                                .taskCount(count)
                                .percentage(percentage)
                                .isUnassigned(true)
                                .build();
                    } else {
                        return ProjectSummaryResponse.WorkloadDto.builder()
                                .name(user.getName())
                                .avatarUrl(user.getAvatarUrl())
                                .taskCount(count)
                                .percentage(percentage)
                                .isUnassigned(false)
                                .build();
                    }
                })
                .collect(Collectors.toList());

        // 6. Type Breakdown (Mock for now as we don't have Task Type in DB yet, assuming all are Tasks)
        // Or we can count subtasks vs tasks if we have that distinction clearly
        List<ProjectSummaryResponse.ChartDataDto> typeBreakdown = new ArrayList<>();
        typeBreakdown.add(ProjectSummaryResponse.ChartDataDto.builder().label("Task").value(totalTasks).build());

        return ProjectSummaryResponse.builder()
                .stats(stats)
                .statusOverview(statusOverview)
                .priorityBreakdown(priorityBreakdown)
                .recentActivities(recentActivities)
                .workload(workload)
                .typeBreakdown(typeBreakdown)
                .build();
    }

    private String getStatusColor(String status) {
        switch (status) {
            case "TODO": return "#dfe1e6";
            case "DOING": return "#0052cc";
            case "DONE": return "#00875a";
            default: return "#dfe1e6";
        }
    }

    private String getPriorityColor(String priority) {
        switch (priority) {
            case "HIGH": return "#e9494a";
            case "MEDIUM": return "#e97f33";
            case "LOW": return "#2684ff";
            default: return "#57d9a3";
        }
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60) return seconds + " seconds ago";
        long minutes = duration.toMinutes();
        if (minutes < 60) return minutes + " minutes ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + " hours ago";
        long days = duration.toDays();
        return days + " days ago";
    }
}
