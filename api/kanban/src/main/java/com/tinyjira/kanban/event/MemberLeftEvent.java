package com.tinyjira.kanban.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberLeftEvent {
    private String projectName;
    private String memberName;
    private String ownerEmail;
}