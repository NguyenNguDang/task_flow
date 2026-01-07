package com.tinyjira.kanban.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_board")
public class Subtask extends AbstractEntity<Long>{
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private boolean completed = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;
}
