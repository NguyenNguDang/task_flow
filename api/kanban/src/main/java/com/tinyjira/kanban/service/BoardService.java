package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.BoardDTO;
import com.tinyjira.kanban.DTO.request.BoardRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface BoardService {
    BoardDTO createBoard(@Valid BoardRequest board);
    
    List<BoardDTO> getBoards();
    
    
    BoardDetailResponse getBoardData(Long id);
    
}
