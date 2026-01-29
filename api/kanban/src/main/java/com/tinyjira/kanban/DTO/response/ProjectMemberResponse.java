package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.utils.ProjectRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectMemberResponse {
    private Long userId;
    private String name;
    private String email;
    private String avatarUrl;
    private ProjectRole role;

    public static ProjectMemberResponse fromUserAndRole(User user, ProjectRole role) {
        return ProjectMemberResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(role)
                .build();
    }
}
