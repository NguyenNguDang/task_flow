package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.model.User;
import org.springframework.web.multipart.MultipartFile;

public interface AttachmentService {
    CommentDto uploadAttachment(Long taskId, User user, MultipartFile file);
}
