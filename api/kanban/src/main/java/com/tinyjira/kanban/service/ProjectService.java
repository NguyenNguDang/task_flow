package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;

public interface ProjectService {
    Project createProject(User owner, CreateProjectRequest request);
}
