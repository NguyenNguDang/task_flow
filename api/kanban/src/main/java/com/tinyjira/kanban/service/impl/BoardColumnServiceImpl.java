package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.DTO.response.ColumnDetailResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.BoardColumnRepository;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.BoardColumnService;
import com.tinyjira.kanban.utils.ColumnRequest;
import com.tinyjira.kanban.utils.ProjectRole;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;
    
    @Transactional
    public List<ColumnDetailResponse> getColumnsByBoardId(Long boardId) {
        List<BoardColumn> columns = boardColumnRepository.findByBoardIdOrderByColumnOrderAsc(boardId);
        
        return columns.stream().map(this::toDto).toList();
    }
    
    @Override
    public ColumnDetailResponse createColumn(Long boardId, ColumnRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceAccessException("Board not found!"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only PM and MEMBER can create columns (based on requirement: Member can add/edit/delete column?)
        // Wait, requirement says: "Member: thao tác bình thường: trừ create/start/complete sprint, thêm user, thay đổi quyền user, thêm, sửa, xóa board, thêm sửa, xóa, column"
        // So Member CANNOT add/edit/delete column. Only PM can.

        if (board.getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to create column.");
        }
        
        int order = boardColumnRepository.findMaxOrderByBoardId(boardId);
        
        String color = request.getColor() != null ? request.getColor() : generateRandomColor();
        
        BoardColumn boardColumn = new BoardColumn(request.getTitle(), order + 1, board, color);
        
        boardColumnRepository.save(boardColumn);
        
        return toDto(boardColumn);
    }

    @Override
    public void deleteColumn(Long columnId) {
        BoardColumn column = boardColumnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceAccessException("Column not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (column.getBoard().getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to delete column.");
        }

        boardColumnRepository.deleteById(columnId);
    }

    @Override
    public ColumnDetailResponse updateColumn(Long columnId, ColumnRequest request) {
        BoardColumn column = boardColumnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceAccessException("Column not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (column.getBoard().getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to update column.");
        }

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
        // Generate a random pastel color
        int r = (random.nextInt(100) + 155); // 155-255
        int g = (random.nextInt(100) + 155);
        int b = (random.nextInt(100) + 155);
        return String.format("#%02x%02x%02x", r, g, b);
    }
}
