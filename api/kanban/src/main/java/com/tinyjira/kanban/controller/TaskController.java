package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.request.MoveTaskRequest;
import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.service.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tasks")
@Slf4j(topic = "TASK-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
    private final TaskService taskService;
    
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
    public ResponseEntity<?> createTask(@RequestBody @Valid TaskRequest taskRequest) {
        TaskDetailResponse response = taskService.createTask(taskRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
    
   
}
