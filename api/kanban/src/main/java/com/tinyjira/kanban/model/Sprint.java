package com.tinyjira.kanban.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tinyjira.kanban.utils.SprintStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_sprint")
public class Sprint extends AbstractEntity<Long>{
    private String name;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime startDate;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime endDate;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime completedAt;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime startedAt;
    
    @Enumerated(EnumType.STRING)
    private SprintStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", referencedColumnName = "id")
    @JsonIgnore
    private Board board;
    
    //Complete sprint
    public void complete(){
        if(this.status == SprintStatus.COMPLETED){
            throw new IllegalStateException("Sprint has already completed");
        }
        if(this.status != SprintStatus.ACTIVE){
            throw new IllegalStateException("Sprint is not active");
        }
        
        this.status = SprintStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }
    
    //Start sprint
    public void start(){
        if(this.status != SprintStatus.PLANNING){
            throw new IllegalStateException("Sprint is not planning");
        }
        this.status = SprintStatus.ACTIVE;
        this.startedAt = LocalDateTime.now();
    }
    
    //date time
    @PrePersist
    public void prePersist() {
        if (this.startDate == null) {
            this.startDate = LocalDateTime.now();
        }
        if (this.endDate == null) {
            this.endDate = this.startDate.plusWeeks(2);
        }
    }
}
