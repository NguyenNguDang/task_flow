package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.utils.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private ProjectRole projectRole;

    public static UserSummaryResponse fromEntity(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .username(user.getEmail())
                .fullName(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
