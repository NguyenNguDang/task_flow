package com.tinyjira.kanban.model;

import com.tinyjira.kanban.utils.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_notification")
public class Notification extends AbstractEntity<Long>{
    private String content;
    private Boolean isRead;
    private NotificationType type;
    private String referenceLink;
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
