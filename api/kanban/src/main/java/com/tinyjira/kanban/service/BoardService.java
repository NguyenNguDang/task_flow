package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.BoardDTO;
import com.tinyjira.kanban.DTO.BoardDTO1;
import com.tinyjira.kanban.DTO.request.BoardRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.model.Board;

import javax.validation.Valid;
import java.util.List;

public interface BoardService {
    BoardDTO createBoard(@Valid BoardRequest board);
    
    List<BoardDTO> getBoards();
    
    
    BoardDetailResponse getBoardData(Long id);
    
}
