package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.BoardDTO;
import com.tinyjira.kanban.DTO.request.BoardRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.service.BoardColumnService;
import com.tinyjira.kanban.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/boards")
@Slf4j(topic = "BOARD-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {
    private final BoardService boardService;
    private final BoardColumnService boardColumnService;
    
    @PostMapping
    public ResponseEntity<?> createBoard(@RequestBody @Valid BoardRequest board) {
        
        BoardDTO recentBoard = boardService.createBoard(board);
        log.info("Created Board");
        return ResponseEntity
                .status(201)
                .body(recentBoard);
    }
    
    @GetMapping
    public ResponseEntity<List<BoardDTO>> getBoards() {
        List<BoardDTO> boards = boardService.getBoards();
        return ResponseEntity
                .status(200)
                .body(boards);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BoardDetailResponse> getBoardData(@PathVariable Long id) {
        BoardDetailResponse board = boardService.getBoardData(id);
        // this.initialiseDatabase();
        return ResponseEntity
                .status(201)
                .body(board);
    }
    
    @GetMapping("/{boardId}/columns")
    public ResponseEntity<?> getBoardColumns(@PathVariable Long boardId) {
        return ResponseEntity.ok(boardColumnService.getColumnsByBoardId(boardId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok("Board deleted successfully");
    }
}
