package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.DTO.request.CreateCommentRequest;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/tasks/{taskId}/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsByTask(taskId));
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user,
            @RequestBody CreateCommentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(taskId, user, request));
    }
}
