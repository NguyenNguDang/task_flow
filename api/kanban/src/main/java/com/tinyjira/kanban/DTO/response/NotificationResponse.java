package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.utils.NotificationType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class NotificationResponse {
    private Long id;
    private String content;
    private Boolean isRead;
    private NotificationType type;
    private String referenceLink;
    private LocalDateTime createdAt;
}
