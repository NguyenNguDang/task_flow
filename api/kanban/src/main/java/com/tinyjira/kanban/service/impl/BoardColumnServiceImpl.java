package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.DTO.response.ColumnDetailResponse;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.repository.BoardColumnRepository;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.service.BoardColumnService;
import com.tinyjira.kanban.utils.ColumnRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardColumnServiceImpl implements BoardColumnService {
    private final BoardColumnRepository boardColumnRepository;
    private final BoardRepository boardRepository;
    
    @Transactional
    public List<ColumnDetailResponse> getColumnsByBoardId(Long boardId) {
        List<BoardColumn> columns = boardColumnRepository.findByBoardIdOrderByColumnOrderAsc(boardId);
        
        return columns.stream().map(this::toDto).toList();
    }
    
    @Override
    public ColumnDetailResponse createColumn(Long boardId, ColumnRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceAccessException("Board not found!"));
        
        int order = boardColumnRepository.findMaxOrderByBoardId(boardId);
        
        BoardColumn boardColumn = new BoardColumn(request.getTitle(), order + 1, board);
        
        boardColumnRepository.save(boardColumn);
        
        return toDto(boardColumn);
    }
    
    private ColumnDetailResponse toDto(BoardColumn boardColumn) {
        return ColumnDetailResponse.builder()
                .id(boardColumn.getId())
                .title(boardColumn.getTitle())
                .position(boardColumn.getColumnOrder())
                .build();
    }
}
