package com.tinyjira.kanban.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_attachment")
public class Attachment extends AbstractEntity<Long>{
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long size;
    
    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;
}
