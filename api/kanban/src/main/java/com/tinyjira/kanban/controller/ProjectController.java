package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.DTO.response.UserSummaryResponse;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
@Slf4j(topic = "PROJECT-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<?> getAllProjects(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(projectService.getAllProjects(pageable));
    }
    
    @PostMapping
    public ResponseEntity<?> createProject(
            @AuthenticationPrincipal User pm,
            @RequestBody @Valid CreateProjectRequest request
    ) {
        Project project = projectService.createProject(pm, request);
        
        ProjectDetailResponse response = ProjectDetailResponse.fromEntity(project);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<UserSummaryResponse>> getProjectMembers(@PathVariable Long projectId) {
        List<UserSummaryResponse> members = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

}
