package com.tinyjira.kanban.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberInvitedEvent {
    private String userEmail;
    private String projectName;
    private String inviterName;
}