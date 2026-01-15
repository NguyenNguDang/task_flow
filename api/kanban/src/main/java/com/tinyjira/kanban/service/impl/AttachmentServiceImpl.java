package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Comment;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.CommentRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.AttachmentService;
import com.tinyjira.kanban.service.strategy.FileStorageStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final FileStorageStrategy fileStorageStrategy;

    @Override
    public CommentDto uploadAttachment(Long taskId, User user, MultipartFile file) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // Create a comment to hold the attachment
        Comment comment = Comment.builder()
                .comment("Uploaded an attachment: " + file.getOriginalFilename())
                .task(task)
                .author(user)
                .build();

        String fileUrl = fileStorageStrategy.store(file);

        comment.addAttachment(
                file.getOriginalFilename(),
                fileUrl,
                file.getContentType(),
                file.getSize()
        );

        Comment savedComment = commentRepository.save(comment);
        return CommentDto.fromEntity(savedComment);
    }
}
