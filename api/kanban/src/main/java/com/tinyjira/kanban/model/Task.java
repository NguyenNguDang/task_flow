package com.tinyjira.kanban.model;

import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_task")
public class Task extends AbstractEntity<Long> {
    @Column(name = "taskKey")
    private String taskKey;
    
    private String title;
    
    private String description;
    
    private Double position;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime dueDate;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToOne
    @JoinColumn(name = "board_column_id")
    private BoardColumn boardColumn;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "task_user",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private Set<Comment> comments = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;
    
    public boolean isUnfinished(){
        return this.status != TaskStatus.DONE;
    }
    
    public void moveToBacklog(){
        this.sprint = null;
    }
    
    public void migrateToSprint(Sprint nextSprint) {
        if (nextSprint == null) {
            throw new IllegalArgumentException("Target Sprint cannot be null");
        }
        this.sprint = nextSprint;
    }
}
