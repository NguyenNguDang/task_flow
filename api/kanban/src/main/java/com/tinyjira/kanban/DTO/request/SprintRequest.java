package com.tinyjira.kanban.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SprintRequest {
    private String boardId;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
}
