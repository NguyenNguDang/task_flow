package com.tinyjira.kanban.DTO.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SprintRequest {
    private String boardId;
    private String name;
}
