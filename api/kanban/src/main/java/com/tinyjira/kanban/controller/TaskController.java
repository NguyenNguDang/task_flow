package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.DTO.request.CreateCommentRequest;
import com.tinyjira.kanban.DTO.request.MoveTaskRequest;
import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.CommentService;
import com.tinyjira.kanban.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tasks")
@Slf4j(topic = "TASK-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Task Controller", description = "Quản lý các công việc")
public class TaskController {
    private final TaskService taskService;
    private final CommentService commentService;
    
    @GetMapping("/{boardId}/active-sprint")
    public ResponseEntity<?> getTasksInActiveSprint(@PathVariable Long boardId) {
        return ResponseEntity.ok(taskService.getTasksInActiveSprint(boardId));
    }
    
    @GetMapping("/{boardId}/list")
    public ResponseEntity<?> getAllTasksByBoardId(@PathVariable @Min(1) Long boardId) {
        List<TaskDetailResponse> taskResponse = taskService.getTasksByBoardId(boardId);
        return ResponseEntity.ok(taskResponse);
    }
    
    @PostMapping
    @Operation(summary = "Create a new task", description = "API này dùng để tạo task mới vào cột")
    public ResponseEntity<?> createTask(@RequestBody @Valid TaskRequest taskRequest) {
        TaskDetailResponse response = taskService.createTask(taskRequest);
        
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Tạo task thành công!");
        result.put("data", response);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(result);
    }
    
    @PutMapping("/update-position")
    public ResponseEntity<String> updateTaskPosition(@Valid @RequestBody MoveTaskRequest request) {
        taskService.moveTask(
                request.getTaskId(),
                request.getNewColumnId(),
                request.getNewIndex()
        );
        
        return ResponseEntity.ok("Task moved successfully");
    }
    
    @PostMapping("/{taskId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User currentUser,
            @ModelAttribute CreateCommentRequest request
    ) {
        CommentDto newComment = commentService.addComment(taskId, currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newComment);
    }
    
   
}
