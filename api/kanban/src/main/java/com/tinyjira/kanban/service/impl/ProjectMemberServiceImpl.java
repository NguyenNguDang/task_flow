package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.event.MemberInvitedEvent;
import com.tinyjira.kanban.event.MemberLeftEvent;
import com.tinyjira.kanban.exception.DomainException;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.ProjectMember;
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
        
        // Allow both PM and MEMBER to invite
        if (!project.hasMember(inviter) && !project.getOwner().getId().equals(inviter.getId())) {
             throw new AccessDeniedException("You must be a member of the project to invite others!");
        }
        
        User userToInvite = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        
        if (project.hasMember(userToInvite) || project.getOwner().getId().equals(userToInvite.getId())) {
            throw new IllegalArgumentException("User is already a member of this project!");
        }
        
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

    @Override
    @Transactional
    public void transferOwnership(Long projectId, Long newOwnerId, User currentOwner) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getOwner().getId().equals(currentOwner.getId())) {
            throw new AccessDeniedException("Only the project owner can transfer ownership!");
        }

        User newOwner = userRepository.findById(newOwnerId)
                .orElseThrow(() -> new ResourceNotFoundException("New owner not found"));

        if (!project.hasMember(newOwner)) {
            throw new IllegalArgumentException("New owner must be a member of the project first!");
        }

        // Update roles
        // 1. Add current owner as a member (if not already explicitly in members list, though usually owner is separate)
        // In this model, owner is a field, members are a list.
        // We need to ensure the old owner becomes a member and new owner is removed from member list and set as owner.
        
        // Add old owner to members list with MEMBER role
        if (!project.hasMember(currentOwner)) {
             project.addMember(currentOwner, ProjectRole.MEMBER);
        } else {
            // Update role if exists
            project.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(currentOwner.getId()))
                .findFirst()
                .ifPresent(m -> m.setProjectRole(ProjectRole.MEMBER));
        }

        // Remove new owner from members list (since they will be owner field)
        project.getMembers().removeIf(m -> m.getUser().getId().equals(newOwner.getId()));
        
        // Set new owner
        project.setOwner(newOwner);

        projectRepository.save(project);
    }
}
