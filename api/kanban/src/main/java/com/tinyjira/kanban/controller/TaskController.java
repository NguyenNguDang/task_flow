package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.CommentDto;
import com.tinyjira.kanban.DTO.request.AssignTaskRequest;
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

import java.nio.file.AccessDeniedException;
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
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTask(@PathVariable @Min(1) Long id) {
        TaskDetailResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(response);
    }
    
    
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
    
    @PutMapping("/{taskId}/assign")
    public ResponseEntity<?> assignTask(
            @PathVariable Long taskId,
            @RequestBody AssignTaskRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            taskService.assignTask(taskId, request.getAssigneeId(), currentUser);
            return ResponseEntity.ok("Task assigned successfully");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Map<String, Object> updates) {
        taskService.updateTask(taskId, updates);
        return ResponseEntity.ok("Task updated successfully");
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @PutMapping("/{taskId}/move-to-sprint")
    public ResponseEntity<?> moveTaskToSprint(
            @PathVariable Long taskId,
            @RequestBody Map<String, Long> request
    ) {
        Long sprintId = request.get("sprintId");
        taskService.moveTaskToSprint(taskId, sprintId);
        return ResponseEntity.ok("Task moved to sprint successfully");
    }
   
}
