package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.response.ProjectDashboardResponse;
import com.tinyjira.kanban.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects/{projectId}/dashboard")
@Slf4j(topic = "SUBTASK-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    private final DashboardService dashboardService;
    
    @GetMapping
    public ResponseEntity<ProjectDashboardResponse> getOverview(@PathVariable Long projectId) {
        return ResponseEntity.ok(dashboardService.getProjectOverview(projectId));
    }
}
