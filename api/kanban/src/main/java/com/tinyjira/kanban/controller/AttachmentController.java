package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/tasks/{taskId}/attachments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AttachmentController {
    private final AttachmentService attachmentService;

    @PostMapping
    public ResponseEntity<CommentDto> uploadAttachment(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attachmentService.uploadAttachment(taskId, user, file));
    }
}
