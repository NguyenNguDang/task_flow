package com.tinyjira.kanban.model;

import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
    private Double estimateHours;
    private Double remainingHours;
    
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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id") // Sẽ tạo cột assignee_id trong DB
    private User assignee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tbl_task_user",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private Set<Comment> comments = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;
    
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtask> subtasks = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskHistory> histories = new ArrayList<>();
    
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
    
    public void assign(User newAssignee) {
        if (this.assignee != null && this.assignee.equals(newAssignee)) {
            return;
        }
        this.assignee = newAssignee;
    }
    
    public boolean canBeAssignedBy(User actor) {
        return true;
    }
    
    public void addSubtask(String title) {
        Subtask subtask = Subtask.builder()
                .title(title)
                .completed(false)
                .task(this)
                .build();
        this.subtasks.add(subtask);
    }
    
    public void removeSubtask(Long subtaskId) {
        this.subtasks.removeIf(s -> s.getId().equals(subtaskId));
    }
    
    public int getProgressPercentage() {
        if (subtasks.isEmpty()) return 0;
        long completedCount = subtasks.stream().filter(Subtask::isCompleted).count();
        return (int) ((completedCount * 100) / subtasks.size());
    }
    
    public void updateEstimation(Double newEstimate) {
        if (newEstimate == null || newEstimate < 0) {
            throw new IllegalArgumentException("Thời gian ước lượng không hợp lệ (phải >= 0)");
        }
        
        if (this.estimateHours == null && this.remainingHours == null) {
            this.remainingHours = newEstimate;
        }
        
        this.estimateHours = newEstimate;
    }
}
