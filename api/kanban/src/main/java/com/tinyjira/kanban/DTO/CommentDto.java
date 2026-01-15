package com.tinyjira.kanban.DTO;

import com.tinyjira.kanban.model.Attachment;
import com.tinyjira.kanban.model.Comment;
import com.tinyjira.kanban.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class CommentDto {
    private Long id;
    private String content;
    private Instant createdAt;
    private String userName;
    private String userAvatar;
    private String attachmentUrl;
    private String attachmentName;
    
    public static CommentDto fromEntity(Comment comment) {
        if (comment == null) return null;
        
        String attachmentUrl = null;
        String attachmentName = null;
        
        if (comment.getAttachments() != null && !comment.getAttachments().isEmpty()) {
            Attachment firstAttachment = comment.getAttachments().get(0);
            attachmentUrl = firstAttachment.getFileUrl();
            attachmentName = firstAttachment.getFileName();
        }
        
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getComment())
                .createdAt(comment.getCreatedOn())
                .userName(comment.getAuthor() != null ? comment.getAuthor().getName() : "Unknown")
                .userAvatar(comment.getAuthor() != null ? comment.getAuthor().getAvatarUrl() : null)
                .attachmentUrl(attachmentUrl)
                .attachmentName(attachmentName)
                .build();
    }
}
