package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.DTO.request.CreateCommentRequest;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Comment;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.CommentRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.CommentService;
import com.tinyjira.kanban.service.strategy.FileStorageStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    
    private final TaskRepository taskRepository;
    private final FileStorageStrategy fileStorageStrategy;
    private final CommentRepository commentRepository;
    
    @Override
    public CommentDto addComment(Long taskId, User author, CreateCommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        // 2. Tạo Comment (Rich Model)
        Comment comment = Comment.builder()
                .comment(request.getContent())
                .task(task)
                .author(author)
                .build();
        
        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            for (MultipartFile file : request.getFiles()) {
                // a. Dùng Strategy để lưu vật lý (Strategy Pattern)
                String fileUrl = fileStorageStrategy.store(file);
                
                // b. Dùng OOP Method để tạo quan hệ trong DB (Rich Domain)
                comment.addAttachment(
                        file.getOriginalFilename(),
                        fileUrl,
                        file.getContentType(),
                        file.getSize()
                );
            }
        }
        
        Comment savedComment = commentRepository.save(comment);
        return CommentDto.fromEntity(savedComment);
    }

    @Override
    public List<CommentDto> getCommentsByTask(Long taskId) {
        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedOnDesc(taskId);
        return comments.stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());
    }
}
