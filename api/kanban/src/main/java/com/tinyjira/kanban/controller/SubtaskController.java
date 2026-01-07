package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.SubtaskDto;
import com.tinyjira.kanban.DTO.request.CreateSubtaskRequest;
import com.tinyjira.kanban.service.SubtaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tasks/{taskId}/subtasks")
@Slf4j(topic = "SUBTASK-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class SubtaskController {
    private final SubtaskService subtaskService;
    
    @PostMapping
    public ResponseEntity<SubtaskDto> createSubtask(
            @PathVariable Long taskId,
            @RequestBody @Valid CreateSubtaskRequest request
    ) {
        return ResponseEntity.ok(subtaskService.createSubtask(taskId, request));
    }
    
    @PatchMapping("/{subtaskId}/toggle")
    public ResponseEntity<?> toggleStatus(@PathVariable Long taskId, @PathVariable Long subtaskId) {
        subtaskService.toggleSubtaskStatus(taskId, subtaskId);
        return ResponseEntity.ok().build();
    }
}
