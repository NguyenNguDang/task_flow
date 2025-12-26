package com.tinyjira.kanban.model;

import com.tinyjira.kanban.utils.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_project_member")
public class Project extends AbstractEntity<Long> {
    private String projectKey;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private ProjectStatus projectStatus;
    
    @OneToMany(mappedBy = "project")
    private List<ProjectMember> members;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}
