package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.ProjectRepository;
import com.tinyjira.kanban.service.ProjectService;
import com.tinyjira.kanban.service.generator.ProjectKeyGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectKeyGenerator keyGenerator;
    
    
    @Override
    public Project createProject(User owner, CreateProjectRequest request) {
        String key = keyGenerator.generate(request.getName());
        
        // 2. Kiểm tra trùng Key (Nếu cần)
        if (projectRepository.existsByProjectKey(key)) {
            key = key + "-" + System.currentTimeMillis() % 1000; // Xử lý trùng đơn giản
        }
        
        // 3. Tạo Entity (Sử dụng static factory method trong Entity)
        Project newProject = Project.createNew(owner, request, key);
        
        // 4. Lưu
        return projectRepository.save(newProject);
    }
}
