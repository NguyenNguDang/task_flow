package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.event.MemberInvitedEvent;
import com.tinyjira.kanban.event.MemberLeftEvent;
import com.tinyjira.kanban.exception.DomainException;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    @Override
    @Transactional
    public void inviteMember(Long projectId, String email, User inviter) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        if (project.getRole(inviter) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You don't have permission to invite member!");
        }
        
        User userToInvite = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        
        project.addMember(userToInvite, ProjectRole.MEMBER);
        
        projectRepository.save(project);
        
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

    @Override
    @Transactional
    public void removeMember(Long projectId, Long userId, User requester) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Only owner can remove members
        if (project.getRole(requester) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You don't have permission to remove member!");
        }

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        project.removeMember(userToRemove);
        projectRepository.save(project);
    }
}
