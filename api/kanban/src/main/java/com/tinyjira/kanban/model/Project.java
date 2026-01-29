package com.tinyjira.kanban.model;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.exception.DomainException;
import com.tinyjira.kanban.utils.ProjectRole;
import com.tinyjira.kanban.utils.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_project")
public class Project extends AbstractEntity<Long> {
    private String projectKey;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private ProjectStatus projectStatus;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectMember> members = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Board> boards = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    public static Project createNew(User owner, CreateProjectRequest req, String generatedKey) {
        return Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .endDate(req.getEndDate())
                .owner(owner)
                .projectKey(generatedKey)
                .startDate(LocalDate.now())
                .createdAt(LocalDateTime.now())
                .projectStatus(ProjectStatus.ACTIVE)
                .build();
    }
    
    public void addMember(User user, ProjectRole role) {
        if (this.members == null) {
            this.members = new ArrayList<>();
        }

        boolean exists = this.members.stream()
                .anyMatch(m -> m.getUser().getId().equals(user.getId()));
        
        if (exists) {
            throw new IllegalArgumentException("User này đã ở trong dự án rồi!");
        }
        
        ProjectMember newMember = ProjectMember.builder()
                .project(this)
                .user(user)
                .projectRole(role)
                .joinedAt(LocalDateTime.now())
                .build();
        
        this.members.add(newMember);
    }
    
    public void removeMember(User user) {
        if (this.owner.getId().equals(user.getId())) {
            throw new DomainException("Chủ dự án không thể rời đi. Vui lòng chuyển quyền Owner trước!");
        }
        
        boolean removed = this.members.removeIf(m -> m.getUser().getId().equals(user.getId()));
        
        if (!removed) {
            throw new DomainException("Người dùng này không phải là thành viên của dự án.");
        }
    }
    
    public boolean hasMember(User user) {
        return members.stream()
                .anyMatch(m -> m.getUser().getId().equals(user.getId()));
    }

    public ProjectRole getRole(User user) {
        if (this.owner != null && this.owner.getId().equals(user.getId())) {
            return ProjectRole.PROJECT_MANAGER;
        }
        return members.stream()
                .filter(m -> m.getUser().getId().equals(user.getId()))
                .findFirst()
                .map(ProjectMember::getProjectRole)
                .orElse(null);
    }
}
