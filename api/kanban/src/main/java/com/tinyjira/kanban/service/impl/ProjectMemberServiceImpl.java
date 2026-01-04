package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.event.MemberInvitedEvent;
import com.tinyjira.kanban.event.MemberLeftEvent;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.ProjectRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.ProjectMemberService;
import com.tinyjira.kanban.utils.ProjectRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    @Override
    @Transactional
    public void inviteMember(Long projectId, String email, User inviter) throws AccessDeniedException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        if (!project.getOwner().equals(inviter)) {
            throw new AccessDeniedException("Bạn không có quyền mời thành viên");
        }
        
        // 3. Tìm User theo email
        User userToInvite = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User với email này chưa đăng ký hệ thống"));
        
        // 4. RICH MODEL: Gọi hàm của Entity để thêm
        project.addMember(userToInvite, ProjectRole.MEMBER);
        
        // 5. Save (Cascade sẽ tự lưu ProjectMember)
        projectRepository.save(project);
        
        // 6. OBSERVER PATTERN: Bắn sự kiện "Đã mời thành công"
        // Service xong việc tại đây, việc gửi mail là việc của người khác
        eventPublisher.publishEvent(new MemberInvitedEvent(
                userToInvite.getEmail(),
                project.getName(),
                inviter.getUsername()
        ));
    }
    
    @Override
    @Transactional
    public void leaveProject(Long projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        project.removeMember(currentUser);
        
        projectRepository.save(project);
        
        eventPublisher.publishEvent(new MemberLeftEvent(
                project.getName(),
                currentUser.getUsername(),
                project.getOwner().getEmail()
        ));
    }
}
