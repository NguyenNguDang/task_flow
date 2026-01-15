package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.DTO.BoardDTO;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Data
@Builder
public class ProjectDetailResponse {
    private Long id;
    private String projectKey;
    private String name;
    private String description;
    private String status;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private UserSummaryDto owner;
    private List<BoardDTO> boards;
   
    public static ProjectDetailResponse fromEntity(Project project) {
        List<BoardDTO> boardDTOs = project.getBoards() != null 
                ? project.getBoards().stream().map(board -> BoardDTO.builder()
                    .id(board.getId())
                    .title(board.getTitle())
                    .description(board.getDescription())
                    .build()).toList()
                : Collections.emptyList();
        
        return ProjectDetailResponse.builder()
                .id(project.getId())
                .projectKey(project.getProjectKey())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getProjectStatus() != null ? project.getProjectStatus().name() : "UNKNOWN")
                .endDate(project.getEndDate())
                .createdAt(project.getCreatedAt())
                // Convert Owner Entity -> Owner DTO
                .owner(UserSummaryDto.fromEntity(project.getOwner()))
                .boards(boardDTOs)
                .build();
    }
    
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
                    .username(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .build();
        }
    }
}