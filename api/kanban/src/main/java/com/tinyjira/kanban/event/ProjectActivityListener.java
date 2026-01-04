package com.tinyjira.kanban.event;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class ProjectActivityListener {
    
    @EventListener
    @Async
    public void handleMemberLeft(MemberLeftEvent event) {
        //TODO: Send email and send Notification to Owner
        System.out.printf("THÔNG BÁO: User %s đã rời khỏi dự án %s. Gửi mail tới Owner: %s%n",
                event.getMemberName(),
                event.getProjectName(),
                event.getOwnerEmail());
    }
}