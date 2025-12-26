package com.tinyjira.kanban.DTO.response;

import com.tinyjira.kanban.utils.SprintStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SprintDetailResponse {
    private Long id;
    private String name;
    private SprintStatus status;
}
