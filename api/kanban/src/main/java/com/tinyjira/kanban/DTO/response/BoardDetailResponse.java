package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BoardDetailResponse {
    private Long id;
    private String title;
    private String description;
    private List<ColumnResponse> columns;
    
    @Data
    @Builder
    public static class ColumnResponse{
        private Long id;
        private String title;
        private Integer order;
        private List<TaskResponse> tasks;
    }
    
    @Data
    @Builder
    public static class TaskResponse {
        private Long id;
        private String title;
        private String description;
        private Priority priority;
        private TaskStatus status;
        private Double position;
        
        
        private Long sprintId;   // Null nếu ở Backlog
        private Long boardColumnId;
        
        //user infor
        private List<UserResponse> assignees;
        private String assigneeAvatar;
        private String assigneeName;
    }
    
    @Data
    @Builder
    public static class UserResponse {
        private Long id;
        private String name;
        private String avatar; // Nếu có
    }
}
