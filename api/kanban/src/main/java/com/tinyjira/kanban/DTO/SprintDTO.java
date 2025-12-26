package com.tinyjira.kanban.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tinyjira.kanban.utils.SprintStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class SprintDTO {
    private Long id;
    
    private String name;
    
    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime startDate;
    
    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime endDate;
    
    private SprintStatus status;
}
