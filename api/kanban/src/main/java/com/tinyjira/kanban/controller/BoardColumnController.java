package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.response.ColumnDetailResponse;
import com.tinyjira.kanban.service.BoardColumnService;
import com.tinyjira.kanban.utils.ColumnRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/board-column")
@Slf4j(topic = "BOARD-COLUMN-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class BoardColumnController {
    private final BoardColumnService boardColumnService;
    
    @PostMapping("/{boardId}")
    public ResponseEntity<ColumnDetailResponse> createColumn(@PathVariable Long boardId,
                                                             @RequestBody @Valid ColumnRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(boardColumnService.createColumn(boardId, request));
    }

    @DeleteMapping("/{columnId}")
    public ResponseEntity<?> deleteColumn(@PathVariable Long columnId) {
        boardColumnService.deleteColumn(columnId);
        return ResponseEntity.ok("Column deleted successfully");
    }

    @PutMapping("/{columnId}")
    public ResponseEntity<ColumnDetailResponse> updateColumn(@PathVariable Long columnId,
                                                             @RequestBody @Valid ColumnRequest request) {
        return ResponseEntity.ok(boardColumnService.updateColumn(columnId, request));
    }
    
}
