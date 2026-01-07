package com.tinyjira.kanban.DTO;

import com.tinyjira.kanban.model.Subtask;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubtaskDto {
    private Long id;
    private String title;
    private boolean completed;
    
    public static SubtaskDto fromEntity(Subtask subtask) {
        return SubtaskDto.builder()
                .id(subtask.getId())
                .title(subtask.getTitle())
                .completed(subtask.isCompleted())
                .build();
    }
}
