package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.NotificationResponse;
import com.tinyjira.kanban.model.User;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getNotifications(User user);
    void markAsRead(Long notificationId);
    void createNotification(User user, String content, com.tinyjira.kanban.utils.NotificationType type, String referenceLink);
}
