package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.response.ProjectMemberResponse;
import com.tinyjira.kanban.event.MemberInvitedEvent;
import com.tinyjira.kanban.event.MemberLeftEvent;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.ProjectMember;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.ProjectRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.security.annotation.RequireProjectRole;
import com.tinyjira.kanban.service.ProjectMemberService;
import com.tinyjira.kanban.utils.ProjectRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, projectIdParam = "projectId")
    public void inviteMember(Long projectId, String email, User inviter) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
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
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER, ProjectRole.VIEWER}, projectIdParam = "projectId")
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
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, projectIdParam = "projectId")
    public void removeMember(Long projectId, Long userId, User requester) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        project.removeMember(userToRemove);
        projectRepository.save(project);
    }

    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, projectIdParam = "projectId")
    public void transferOwnership(Long projectId, Long newOwnerId, User currentOwner) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User newOwner = userRepository.findById(newOwnerId)
                .orElseThrow(() -> new ResourceNotFoundException("New owner not found"));

        if (!project.hasMember(newOwner)) {
            throw new IllegalArgumentException("New owner must be a member of the project first!");
        }
        
        if (!project.hasMember(currentOwner)) {
             project.addMember(currentOwner, ProjectRole.MEMBER);
        } else {
            project.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(currentOwner.getId()))
                .findFirst()
                .ifPresent(m -> m.setProjectRole(ProjectRole.MEMBER));
        }

        project.getMembers().removeIf(m -> m.getUser().getId().equals(newOwner.getId()));
        
        project.setOwner(newOwner);

        projectRepository.save(project);
    }

    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, projectIdParam = "projectId")
    public void changeMemberRole(Long projectId, Long userId, ProjectRole newRole, User requester) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getOwner().getId().equals(userId)) {
             throw new IllegalArgumentException("Cannot change role of the project owner!");
        }

        ProjectMember member = project.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));

        member.setProjectRole(newRole);
        projectRepository.save(project);
    }

    @Override
    @Transactional(readOnly = true)
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER, ProjectRole.VIEWER}, projectIdParam = "projectId")
    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        List<ProjectMemberResponse> responses = new ArrayList<>();

        // Add Owner
        responses.add(ProjectMemberResponse.fromUserAndRole(project.getOwner(), ProjectRole.PROJECT_MANAGER));

        // Add other members
        List<ProjectMemberResponse> members = project.getMembers().stream()
                .map(m -> ProjectMemberResponse.fromUserAndRole(m.getUser(), m.getProjectRole()))
                .toList();
        
        responses.addAll(members);

        return responses;
    }
}
