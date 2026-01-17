package com.tinyjira.kanban.event;

import com.tinyjira.kanban.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationListener {
    
    private final EmailService emailService;

    @EventListener
    @Async
    public void handleMemberInvited(MemberInvitedEvent event) {
        log.info(">>> Sending email to: {}", event.getUserEmail());
        
        String subject = "Lời mời tham gia dự án: " + event.getProjectName();
        String body = String.format("""
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Xin chào!</h2>
                <p><strong>%s</strong> đã mời bạn tham gia vào dự án <strong>%s</strong>.</p>
                <p>Hãy truy cập hệ thống để xem chi tiết.</p>
                <br/>
                <p>Trân trọng,<br/>TaskFlow Team</p>
            </div>
            """, event.getInviterName(), event.getProjectName());
        
        emailService.sendEmail(event.getUserEmail(), subject, body);
    }
}
