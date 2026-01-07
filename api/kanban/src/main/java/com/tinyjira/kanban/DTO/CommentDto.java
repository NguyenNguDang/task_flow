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
    private UserSummaryDto author;
    private List<AttachmentDto> attachments;
    
    public static CommentDto fromEntity(Comment comment) {
        if (comment == null) return null;
        
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getComment())
                .createdAt(comment.getCreatedOn())
                .author(UserSummaryDto.fromEntity(comment.getAuthor()))
                .attachments(comment.getAttachments() != null
                        ? comment.getAttachments().stream()
                        .map(AttachmentDto::fromEntity)
                        .collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }
    
    @Data
    @Builder
    public static class AttachmentDto {
        private Long id;
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long size;
        
        public static AttachmentDto fromEntity(Attachment attachment) {
            return AttachmentDto.builder()
                    .id(attachment.getId())
                    .fileName(attachment.getFileName())
                    .fileUrl(attachment.getFileUrl())
                    .fileType(attachment.getFileType())
                    .size(attachment.getSize())
                    .build();
        }
    }
    
    @Data
    @Builder
    public static class UserSummaryDto {
        private Long id;
        private String username;
        private String avatarUrl;
        
        public static UserSummaryDto fromEntity(User user) {
            if (user == null) return null;
            return UserSummaryDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .avatarUrl(user.getAvatarUrl()) // Nếu User có trường này
                    .build();
        }
    }
}
