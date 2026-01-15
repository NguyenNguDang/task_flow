package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.impl.SprintServiceImpl;
import com.tinyjira.kanban.service.strategy.MvpScoringStrategy;
import com.tinyjira.kanban.utils.SprintStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SprintServiceImplTest {

    @Mock
    private SprintRepository sprintRepository;
    @Mock
    private BoardRepository boardRepository;
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private MvpScoringStrategy mvpScoringStrategy;

    @InjectMocks
    private SprintServiceImpl sprintService;

    @Test
    @DisplayName("Create Sprint: Should name 'Sprint 1' if no previous sprints")
    void createSprint_FirstSprint() {
        // Given
        Long boardId = 1L;
        Board board = new Board();
        board.setId(boardId);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(sprintRepository.findLastSprintNameByBoardId(boardId)).thenReturn(Optional.empty());
        when(sprintRepository.save(any(Sprint.class))).thenAnswer(i -> i.getArgument(0));

        // When
        SprintDTO result = sprintService.createSprint(boardId);

        // Then
        ArgumentCaptor<Sprint> captor = ArgumentCaptor.forClass(Sprint.class);
        verify(sprintRepository).save(captor.capture());
        
        assertEquals("Sprint 1", captor.getValue().getName());
        assertEquals(SprintStatus.PLANNING, captor.getValue().getStatus());
    }

    @Test
    @DisplayName("Create Sprint: Should increment name (Sprint 5 -> Sprint 6)")
    void createSprint_IncrementName() {
        // Given
        Long boardId = 1L;
        Board board = new Board();
        board.setId(boardId);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(sprintRepository.findLastSprintNameByBoardId(boardId)).thenReturn(Optional.of("Sprint 5"));
        when(sprintRepository.save(any(Sprint.class))).thenAnswer(i -> i.getArgument(0));

        // When
        sprintService.createSprint(boardId);

        // Then
        ArgumentCaptor<Sprint> captor = ArgumentCaptor.forClass(Sprint.class);
        verify(sprintRepository).save(captor.capture());
        
        assertEquals("Sprint 6", captor.getValue().getName());
    }
    
    @Test
    @DisplayName("Start Sprint: Should change status to ACTIVE")
    void startSprint_Success() {
        // Given
        Long sprintId = 10L;
        Sprint sprint = Sprint.builder().status(SprintStatus.PLANNING).build();
        sprint.setId(sprintId);
        
        when(sprintRepository.findById(sprintId)).thenReturn(Optional.of(sprint));
        
        // When
        sprintService.startSprint(sprintId);
        
        // Then
        assertEquals(SprintStatus.ACTIVE, sprint.getStatus());
        verify(sprintRepository).save(sprint);
    }
}