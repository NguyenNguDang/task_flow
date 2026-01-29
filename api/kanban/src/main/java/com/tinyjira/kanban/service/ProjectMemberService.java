package com.tinyjira.kanban.service;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.utils.ProjectRole;

public interface ProjectMemberService {
    void inviteMember(Long projectId, String email, User inviter);
    void leaveProject(Long projectId, User currentUser);
    void removeMember(Long projectId, Long userId, User requester);
    void transferOwnership(Long projectId, Long newOwnerId, User currentOwner);
    void changeMemberRole(Long projectId, Long userId, ProjectRole newRole, User requester);
}
