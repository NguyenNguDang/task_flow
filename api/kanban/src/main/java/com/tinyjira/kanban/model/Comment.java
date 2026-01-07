package com.tinyjira.kanban.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_comment")
public class Comment extends AbstractEntity<Long> {
    
    private String Id_comment;
    
    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant updatedOn;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
    
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Attachment> attachments = new ArrayList<>();
    
    public void addAttachment(String name, String url, String type, Long size) {
        Attachment attachment = Attachment.builder()
                .fileName(name)
                .fileUrl(url)
                .fileType(type)
                .size(size)
                .comment(this)
                .build();
        this.attachments.add(attachment);
    }
}
