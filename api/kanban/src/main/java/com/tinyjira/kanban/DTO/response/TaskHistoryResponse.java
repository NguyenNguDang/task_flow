package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.model.TaskHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskHistoryResponse {
    private Long id;
    private String userName;
    private String userAvatar;
    private String field;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;

    public static TaskHistoryResponse fromEntity(TaskHistory history) {
        return TaskHistoryResponse.builder()
                .id(history.getId())
                .userName(history.getUser() != null ? history.getUser().getName() : "System")
                .userAvatar(history.getUser() != null ? history.getUser().getAvatarUrl() : null)
                .field(history.getField())
                .oldValue(history.getOldValue())
                .newValue(history.getNewValue())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
