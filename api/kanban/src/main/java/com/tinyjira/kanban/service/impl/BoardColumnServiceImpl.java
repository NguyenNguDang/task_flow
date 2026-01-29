package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.response.ColumnDetailResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.repository.BoardColumnRepository;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.security.annotation.RequireProjectRole;
import com.tinyjira.kanban.service.BoardColumnService;
import com.tinyjira.kanban.utils.ColumnRequest;
import com.tinyjira.kanban.utils.ProjectRole;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardColumnServiceImpl implements BoardColumnService {
    private final BoardColumnRepository boardColumnRepository;
    private final BoardRepository boardRepository;
    
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER, ProjectRole.VIEWER}, boardIdParam = "boardId")
    public List<ColumnDetailResponse> getColumnsByBoardId(Long boardId) {
        List<BoardColumn> columns = boardColumnRepository.findByBoardIdOrderByColumnOrderAsc(boardId);
        
        return columns.stream().map(this::toDto).toList();
    }
    
    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, boardIdParam = "boardId")
    public ColumnDetailResponse createColumn(Long boardId, ColumnRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceAccessException("Board not found!"));
        
        int order = boardColumnRepository.findMaxOrderByBoardId(boardId);
        
        String color = request.getColor() != null ? request.getColor() : generateRandomColor();
        
        BoardColumn boardColumn = new BoardColumn(request.getTitle(), order + 1, board, color);
        
        boardColumnRepository.save(boardColumn);
        
        return toDto(boardColumn);
    }

    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, columnIdParam = "columnId")
    public void deleteColumn(Long columnId) {
        boardColumnRepository.deleteById(columnId);
    }

    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER}, columnIdParam = "columnId")
    public ColumnDetailResponse updateColumn(Long columnId, ColumnRequest request) {
        BoardColumn column = boardColumnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceAccessException("Column not found"));

        if (request.getTitle() != null) {
            column.setTitle(request.getTitle());
        }
        if (request.getColor() != null) {
            column.setColor(request.getColor());
        }

        boardColumnRepository.save(column);
        return toDto(column);
    }
    
    private ColumnDetailResponse toDto(BoardColumn boardColumn) {
        return ColumnDetailResponse.builder()
                .id(boardColumn.getId())
                .title(boardColumn.getTitle())
                .position(boardColumn.getColumnOrder())
                .color(boardColumn.getColor())
                .build();
    }

    private String generateRandomColor() {
        Random random = new Random();
        int r = (random.nextInt(100) + 155);
        int g = (random.nextInt(100) + 155);
        int b = (random.nextInt(100) + 155);
        return String.format("#%02x%02x%02x", r, g, b);
    }
}
