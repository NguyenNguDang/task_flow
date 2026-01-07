package com.tinyjira.kanban.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_sprint_history", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"sprint_id", "record_date"})
})
public class SprintHistory extends AbstractEntity<Long> {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;
    
    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;
    
    @Column(name = "remaining_hours")
    private Double remainingHours;
    
    @Column(name = "completed_hours")
    private Double completedHours;
}
