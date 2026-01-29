package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.BoardDTO;
import com.tinyjira.kanban.DTO.request.BoardRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.model.Project;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.BoardColumnRepository;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.ProjectRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.BoardService;
import com.tinyjira.kanban.utils.ProjectRole;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "BOARD-SERVICE")
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;
    private final ProjectRepository projectRepository;
    private final BoardColumnRepository boardColumnRepository;
    private final UserRepository userRepository;
    
    @Override
    @Transactional
    public BoardDTO createBoard(BoardRequest request){
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (project.getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to create board.");
        }
        
        Board board = Board.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .build();
        
        Board savedBoard = boardRepository.save(board);

        // Create default columns
        List<BoardColumn> defaultColumns = new ArrayList<>();
        defaultColumns.add(new BoardColumn("TODO", 0, savedBoard, "#dfe1e6"));
        defaultColumns.add(new BoardColumn("DOING", 1, savedBoard, "#dfe1e6"));
        defaultColumns.add(new BoardColumn("DONE", 2, savedBoard, "#e3fcef")); // Xanh lá nhạt cho DONE

        boardColumnRepository.saveAll(defaultColumns);
        
        return toDTO(savedBoard);
    }
    
    @Override
    public List<BoardDTO> getBoards() {
        List<Board> boards = boardRepository.findAllBoards();
        
        return boards.stream()
                .map(this::toDTO).toList();
    }
    
    @Override
    public BoardDetailResponse getBoardData(Long id) {
        Board board = boardRepository.findBoardFullDetail(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        
        //map column
        List<BoardDetailResponse.ColumnResponse> columnDTOs = board.getColumns().stream()
                // sort column columnOrder
                .sorted(Comparator.comparing(BoardColumn::getColumnOrder))
                .map(col -> {
                    
                    // --- each Column, map Tasks ---
                    List<BoardDetailResponse.TaskResponse> taskDTOs = col.getTasks().stream()
                            // sort task with id
                            .sorted(Comparator.comparing(Task::getId))
                            .map(task -> {
                                
                                // --- each Task, map Users ---
                                List<BoardDetailResponse.UserResponse> userDTOs = task.getUsers().stream()
                                        .map(user -> BoardDetailResponse.UserResponse.builder()
                                                .id(user.getId())
                                                .name(user.getName())
                                                .build())
                                        .toList();
                                return BoardDetailResponse.TaskResponse.builder()
                                        .id(task.getId())
                                        .title(task.getTitle())
                                        .description(task.getDescription())
                                        .priority(task.getPriority())
                                        .position(task.getPosition())
                                        .assignees(userDTOs)
                                        .build();
                            })
                            .toList();
                    
                    // Trả về Column DTO
                    return BoardDetailResponse.ColumnResponse.builder()
                            .id(col.getId())
                            .title(col.getTitle())
                            .order(col.getColumnOrder())
                            .color(col.getColor())
                            .tasks(taskDTOs)
                            .build();
                })
                .toList();
        
        return BoardDetailResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .columns(columnDTOs)
                .build();
    }

    @Override
    @Transactional
    public BoardDTO updateBoard(Long id, BoardRequest request) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (board.getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to update board.");
        }

        board.setTitle(request.getTitle());
        board.setDescription(request.getDescription());

        Board updatedBoard = boardRepository.save(board);
        return toDTO(updatedBoard);
    }

    @Override
    @Transactional
    public void deleteBoard(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (board.getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to delete board.");
        }

        boardRepository.deleteById(id);
    }
    
    private BoardDTO toDTO(Board board) {
        return BoardDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .build();
    }
}
