package com.tinyjira.kanban.event;

import com.tinyjira.kanban.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationListener {
    
    private final EmailService emailService; // Giả sử đã có service gửi mail
    

    @EventListener
    @Async
    public void handleMemberInvited(MemberInvitedEvent event) {
        System.out.println(">>> Đang gửi email tới: " + event.getUserEmail());
        
        String subject = "Lời mời tham gia dự án: " + event.getProjectName();
        String body = "Xin chào, " + event.getInviterName() + " đã mời bạn tham gia...";
        
        emailService.sendEmail(event.getUserEmail(), subject, body);
    }
}