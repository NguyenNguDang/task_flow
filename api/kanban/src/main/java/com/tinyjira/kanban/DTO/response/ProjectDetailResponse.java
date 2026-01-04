package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProjectDetailResponse {
    private Long id;
    private String projectKey;
    private String name;
    private String description;
    private String status;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private UserSummaryDto owner;
   
    public static ProjectDetailResponse fromEntity(Project project) {
        return ProjectDetailResponse.builder()
                .id(project.getId())
                .projectKey(project.getProjectKey())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getProjectStatus().name()) // Enum to String
                .endDate(project.getEndDate())
                .createdAt(project.getCreatedAt())
                // Convert Owner Entity -> Owner DTO
                .owner(UserSummaryDto.fromEntity(project.getOwner()))
                .build();
    }
    
    // Inner DTO hoặc tách ra file riêng (tùy bạn)
    @Data
    @Builder
    public static class UserSummaryDto {
        private Long id;
        private String username;
        private String avatarUrl;
        
        public static UserSummaryDto fromEntity(User user) {
            if (user == null) return null;
            return UserSummaryDto.builder()
                    .id(user.getId())
                    .username(user.getUsername()) // Hoặc getFullName
                    .avatarUrl(user.getAvatarUrl())
                    .build();
        }
    }
}