package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.DTO.response.UserSummaryResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.ProjectRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.ProjectService;
import com.tinyjira.kanban.service.generator.ProjectKeyGenerator;
import com.tinyjira.kanban.utils.ProjectRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Override
    @Transactional
    public void updateProject(Long projectId, Map<String, Object> updates) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (project.getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to update this project.");
        }

        updates.forEach((key, value) -> {
            switch (key) {
                case "name":
                    project.setName((String) value);
                    break;
                case "description":
                    project.setDescription((String) value);
                    break;
                case "endDate":
                    if (value != null && !value.toString().isEmpty()) {
                        project.setEndDate(LocalDate.parse(value.toString()));
                    }
                    break;
                default:
                    log.warn("Unknown field to update: {}", key);
            }
        });

        projectRepository.save(project);
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (project.getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to delete this project.");
        }

        projectRepository.deleteById(projectId);
    }
}
