package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.ProjectDashboardResponse;

public interface DashboardService {
    ProjectDashboardResponse getProjectOverview(Long projectId);
}
