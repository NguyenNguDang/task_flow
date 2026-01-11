package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProjectService {
    Project createProject(User owner, CreateProjectRequest request);
    
    Page<ProjectDetailResponse> getAllProjects(Pageable pageable);
    
}
