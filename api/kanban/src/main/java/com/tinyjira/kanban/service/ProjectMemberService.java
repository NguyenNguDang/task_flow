package com.tinyjira.kanban.service;

import com.tinyjira.kanban.model.User;

import java.nio.file.AccessDeniedException;

public interface ProjectMemberService {
    void inviteMember(Long projectId, String email, User inviter) throws AccessDeniedException;
    void leaveProject(Long projectId, User currentUser);
}
