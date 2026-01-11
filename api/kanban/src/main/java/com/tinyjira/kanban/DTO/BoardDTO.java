package com.tinyjira.kanban.DTO;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class BoardDTO {
    private Long id;
    private String title;
    private String description;
}
