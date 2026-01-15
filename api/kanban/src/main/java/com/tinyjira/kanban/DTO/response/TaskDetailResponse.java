package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
public class TaskDetailResponse {
    private Long id;
    private Long boardColumnId;
    private Long sprintId;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Priority priority;
    private Integer position;
    private Double estimateHours;
    private UserInfo assignee;
    private UserInfo reporter;
    private SprintInfo sprint;
    
    private List<SubtaskInfo> subtasks;
    private List<CommentInfo> comments;
    
    
    public static TaskDetailResponse fromEntity(Task task) {
        if (task == null) return null;
        
        return TaskDetailResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .startDate(task.getStartDate() != null ? task.getStartDate().toLocalDate() : null)
                .dueDate(task.getDueDate() != null ? task.getDueDate().toLocalDate() : null)
                .position(task.getPosition() != null ? task.getPosition().intValue() : 0)
                .estimateHours(task.getEstimateHours())
                .boardColumnId(task.getBoardColumn() != null ? task.getBoardColumn().getId() : null)
                .sprintId(task.getSprint() != null ? task.getSprint().getId() : null)
                
                // Map Nested Objects
                .assignee(task.getAssignee() != null ?
                        new UserInfo(task.getAssignee().getId(), task.getAssignee().getName(), task.getAssignee().getAvatarUrl()) : null)
                .reporter(task.getCreator() != null ?
                        new UserInfo(task.getCreator().getId(), task.getCreator().getName() + " " + task.getCreator().getLastname(), task.getCreator().getAvatarUrl()) : null)
                .sprint(task.getSprint() != null ?
                        new SprintInfo(task.getSprint().getId(), task.getSprint().getName()) : null)
                
                // Map Lists (Xử lý null safe)
                .subtasks(task.getSubtasks() == null ? Collections.emptyList() :
                        task.getSubtasks().stream()
                                .map(s -> new SubtaskInfo(s.getId(), s.getTitle(), s.isCompleted()))
                                .collect(Collectors.toList()))
                .comments(task.getComments() == null ? Collections.emptyList() :
                        task.getComments().stream()
                                .map(c -> new CommentInfo(c.getId(), c.getComment(), LocalDateTime.ofInstant(c.getCreatedOn(), ZoneId.systemDefault()),
                                        c.getAuthor() != null ? c.getAuthor().getName() : "Unknown",
                                        c.getAuthor() != null ? c.getAuthor().getAvatarUrl() : null))
                                .collect(Collectors.toList()))
                .build();
    }
    
    @Data
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }
    
    @Data
    @AllArgsConstructor
    public static class SprintInfo {
        private Long id;
        private String name;
    }
    
    @Data
    @AllArgsConstructor
    public static class SubtaskInfo {
        private Long id;
        private String title;
        private boolean completed;
    }
    
    @Data
    @AllArgsConstructor
    public static class CommentInfo {
        private Long id;
        private String content;
        private LocalDateTime createdAt;
        private String userName;
        private String userAvatar;
    }
    
}
