package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.ProjectSummaryResponse;

public interface ProjectSummaryService {
    ProjectSummaryResponse getProjectSummary(Long projectId);
}
