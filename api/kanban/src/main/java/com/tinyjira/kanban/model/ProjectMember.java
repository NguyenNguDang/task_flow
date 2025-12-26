package com.tinyjira.kanban.model;


import com.tinyjira.kanban.utils.ProjectRole;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_project_member")
public class ProjectMember extends AbstractEntity<Long>{

    private ProjectRole projectRole;
    
    private LocalDateTime joinedAt;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    
}
