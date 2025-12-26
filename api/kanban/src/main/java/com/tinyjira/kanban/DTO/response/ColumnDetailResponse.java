package com.tinyjira.kanban.DTO.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ColumnDetailResponse {
    private Long id;
    private String title;
    private Integer position;
}
