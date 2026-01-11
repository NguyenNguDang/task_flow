package com.tinyjira.kanban.DTO.request;

import lombok.Getter;

@Getter
public class ProjectMemberRequest {
    private Long projectId;
    private String email;
}
