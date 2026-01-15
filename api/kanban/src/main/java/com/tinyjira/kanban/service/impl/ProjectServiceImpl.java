package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.DTO.response.UserSummaryResponse;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.ProjectRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.ProjectService;
import com.tinyjira.kanban.service.generator.ProjectKeyGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectKeyGenerator keyGenerator;
    private final UserRepository userRepository;
    
    
    @Override
    @Transactional
    public Project createProject(User owner, CreateProjectRequest request) {
        String key = keyGenerator.generate(request.getName());
        
        if (projectRepository.existsByProjectKey(key)) {
            key = key + "-" + System.currentTimeMillis() % 1000;
        }
        
        Project newProject = Project.createNew(owner, request, key);
        if (newProject.getMembers() == null) {
            newProject.setMembers(new ArrayList<>());
        }
        
        return projectRepository.save(newProject);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDetailResponse> getAllProjects(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return projectRepository.findByUserEmail(email, pageable)
                .map(ProjectDetailResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getProjectMembers(Long projectId) {
        List<User> users = userRepository.findUsersByProjectId(projectId);
        return users.stream()
                .map(UserSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
