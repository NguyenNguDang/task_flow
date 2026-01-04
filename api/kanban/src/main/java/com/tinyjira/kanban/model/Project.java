package com.tinyjira.kanban.model;

import com.tinyjira.kanban.DTO.request.CreateProjectRequest;
import com.tinyjira.kanban.exception.DomainException;
import com.tinyjira.kanban.utils.ProjectRole;
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
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members;
    
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
                .startDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .projectStatus(ProjectStatus.ACTIVE)
                .build();
    }
    
    public void addMember(User user, ProjectRole role) {
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
        if (this.owner.equals(user)) {
            throw new DomainException("Chủ dự án không thể rời đi. Vui lòng chuyển quyền Owner trước!");
        }
        
        boolean removed = this.members.removeIf(m -> m.getUser().equals(user));
        
        if (!removed) {
            throw new DomainException("Người dùng này không phải là thành viên của dự án.");
        }
    }
}
