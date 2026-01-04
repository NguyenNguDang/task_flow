package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/projects")
@Slf4j(topic = "PROJECT-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {
    private final ProjectService projectService;
    
    @PostMapping
    public ResponseEntity<?> createProject(
            @AuthenticationPrincipal User pm,
            @RequestBody @Valid CreateProjectRequest request
    ) {
        Project project = projectService.createProject(pm, request);
        
        ProjectDetailResponse response = ProjectDetailResponse.fromEntity(project);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
