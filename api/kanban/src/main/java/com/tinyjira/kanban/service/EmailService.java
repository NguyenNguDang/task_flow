package com.tinyjira.kanban.service;

public interface EmailService {
    void sendEmail(String userEmail, String subject, String body);
}
