package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.response.NotificationResponse;
import com.tinyjira.kanban.event.TaskAssignedEvent;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Notification;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.NotificationRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.NotificationService;
import com.tinyjira.kanban.utils.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<NotificationResponse> getNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void createNotification(User user, String content, NotificationType type, String referenceLink) {
        Notification notification = Notification.builder()
                .user(user)
                .content(content)
                .type(type)
                .isRead(false)
                .referenceLink(referenceLink)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }

    @EventListener
    public void handleTaskAssignedEvent(TaskAssignedEvent event) {
        User assignee = userRepository.findByEmail(event.getAssigneeEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String content = String.format("%s assigned you to task: %s", event.getAssignerName(), event.getTaskTitle());
        String referenceLink = "/project/task/" + event.getTaskId(); // Adjust link as needed
        
        createNotification(assignee, content, NotificationType.ASSIGN, referenceLink);
    }

    private NotificationResponse toDTO(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .type(notification.getType())
                .referenceLink(notification.getReferenceLink())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
