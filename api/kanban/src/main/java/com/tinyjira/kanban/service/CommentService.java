package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.DTO.request.CreateCommentRequest;
import com.tinyjira.kanban.model.User;

public interface CommentService {
    CommentDto addComment(Long taskId, User author, CreateCommentRequest request);
}
