package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmail(String userEmail, String subject, String body) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(userEmail);
            helper.setSubject(subject);
            helper.setText(body, true); // true = isHtml
            
            javaMailSender.send(message);
            log.info("Email sent successfully to {}", userEmail);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", userEmail, e);
        }
    }
}
