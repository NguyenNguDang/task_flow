package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.TaskStatusCount;
import com.tinyjira.kanban.DTO.response.ProjectDashboardResponse;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.DashboardService;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final TaskRepository taskRepository;
    
    @Override
    public ProjectDashboardResponse getProjectOverview(Long projectId) {
        List<TaskStatusCount> rawData = taskRepository.countTasksByStatus(projectId);
        
        Long totalTasks = rawData.stream().mapToLong(TaskStatusCount::getCount).sum();
        
        List<ProjectDashboardResponse.ChartItem> chartItems = rawData.stream()
                .filter(item -> item.getStatus() != null) // Lọc bỏ các item có status null
                .map(item -> new ProjectDashboardResponse.ChartItem(
                        item.getStatus().name(),
                        item.getCount(),
                        getColorForStatus(item.getStatus())
                ))
                .collect(Collectors.toList());
        
        return ProjectDashboardResponse.builder()
                .projectId(projectId)
                .totalTasks(totalTasks)
                .pieChartData(chartItems)
                .build();
    }
    
    private String getColorForStatus(TaskStatus status) {
        if (status == null) return "#42526E";
        return switch (status) {
            case DONE -> "#36B37E"; //Green
            case DOING -> "#0052CC"; //Blue
            default -> "#42526E"; // Gray
        };
    }
}
