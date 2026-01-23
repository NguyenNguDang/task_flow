package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.event.TaskAssignedEvent;
import com.tinyjira.kanban.model.*;
import com.tinyjira.kanban.repository.*;
import com.tinyjira.kanban.service.impl.TaskServiceImpl;
import com.tinyjira.kanban.utils.Priority;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private ColumnRepository columnRepository; // Alias for BoardColumnRepository in Service
    @Mock
    private BoardColumnRepository boardColumnRepository;
    @Mock
    private BoardRepository boardRepository;
    @Mock
    private SprintRepository sprintRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    @DisplayName("Create Task: Should calculate position correctly when column is empty")
    void createTask_WhenColumnEmpty_ShouldSetDefaultPosition() {
        // Given
        TaskRequest request = new TaskRequest();
        request.setTitle("New Task");
        request.setColumnId(1L);
        request.setBoardId(1L);
        request.setSprintId(1L);
        request.setPriority(Priority.MEDIUM);

        User creator = User.builder().email("creator@test.com").build();
        creator.setId(1L);

        BoardColumn column = new BoardColumn();
        column.setId(1L);
        Board board = new Board();
        board.setId(1L);
        Sprint sprint = new Sprint();
        sprint.setId(1L);

        when(boardColumnRepository.findById(1L)).thenReturn(Optional.of(column));
        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        when(sprintRepository.findById(1L)).thenReturn(Optional.of(sprint));
        
        when(taskRepository.findMaxPositionByBoardColumnId(1L)).thenReturn(null); // Column empty
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> {
            Task t = i.getArgument(0);
            t.setId(100L);
            return t;
        });

        // When
        TaskDetailResponse response = taskService.createTask(request, creator);

        // Then
        assertNotNull(response);
        assertEquals("New Task", response.getTitle());
        
        // Verify position logic: Default 1000.0 if null
        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(taskCaptor.capture());
        assertEquals(1000.0, taskCaptor.getValue().getPosition());
    }

    @Test
    @DisplayName("Create Task: Should add to bottom when column has tasks")
    void createTask_WhenColumnHasTasks_ShouldAddToBottom() {
        // Given
        TaskRequest request = new TaskRequest();
        request.setColumnId(1L);
        request.setBoardId(1L);
        request.setSprintId(1L);

        User creator = User.builder().email("creator@test.com").build();
        creator.setId(1L);

        when(boardColumnRepository.findById(1L)).thenReturn(Optional.of(new BoardColumn()));
        when(boardRepository.findById(1L)).thenReturn(Optional.of(new Board()));
        when(sprintRepository.findById(1L)).thenReturn(Optional.of(new Sprint()));
        
        when(taskRepository.findMaxPositionByBoardColumnId(1L)).thenReturn(2000.0); // Max pos is 2000
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> i.getArgument(0));

        // When
        taskService.createTask(request, creator);

        // Then
        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(taskCaptor.capture());
        assertEquals(3000.0, taskCaptor.getValue().getPosition()); // 2000 + 1000
    }

    @Test
    @DisplayName("Move Task: Should update column and position")
    void moveTask_ShouldUpdatePosition() {
        // Given
        Long taskId = 1L;
        Long targetColumnId = 2L;
        int newIndex = 0; // Move to top

        BoardColumn targetColumn = new BoardColumn();
        targetColumn.setId(targetColumnId);
        Task taskToMove = Task.builder().position(5000.0).build();
        taskToMove.setId(taskId);
        
        // Existing tasks in target column
        Task existingTask1 = Task.builder().position(1000.0).build();
        existingTask1.setId(2L);
        Task existingTask2 = Task.builder().position(2000.0).build();
        existingTask2.setId(3L);
        List<Task> tasksInColumn = new ArrayList<>(List.of(existingTask1, existingTask2));

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskToMove));
        when(columnRepository.findById(targetColumnId)).thenReturn(Optional.of(targetColumn));
        when(taskRepository.findByBoardColumnOrderByPositionAsc(targetColumn)).thenReturn(tasksInColumn);

        // When
        taskService.moveTask(taskId, targetColumnId, newIndex);

        // Then
        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(captor.capture());
        
        Task savedTask = captor.getValue();
        assertEquals(targetColumn, savedTask.getBoardColumn());
        // Logic: (MIN_POSITION + firstTaskPos) / 2 => (0 + 1000) / 2 = 500
        assertEquals(500.0, savedTask.getPosition());
    }

    @Test
    @DisplayName("Assign Task: Should succeed when user is in project")
    void assignTask_Success() throws Exception {
        // Given
        Long taskId = 1L;
        Long assigneeId = 2L;
        
        User currentUser = User.builder().email("pm@test.com").build();
        currentUser.setId(99L);
        User assignee = User.builder().email("dev@test.com").build();
        assignee.setId(assigneeId);
        
        Project project = Project.builder().members(new ArrayList<>()).build();
        project.setId(10L);
        project.addMember(assignee, null); // Add assignee to project
        
        Board board = Board.builder().project(project).build();
        Task task = Task.builder().board(board).title("Test Task").build();
        task.setId(taskId);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee));

        // When
        taskService.assignTask(taskId, assigneeId, currentUser);

        // Then
        assertEquals(assignee, task.getAssignee());
        verify(taskRepository).save(task);
        verify(eventPublisher).publishEvent(any(TaskAssignedEvent.class));
    }

    @Test
    @DisplayName("Assign Task: Should fail when user is NOT in project")
    void assignTask_Fail_UserNotInProject() {
        // Given
        Long taskId = 1L;
        Long assigneeId = 2L;
        User currentUser = new User();
        User assignee = User.builder().build();
        assignee.setId(assigneeId);
        
        Project project = Project.builder().members(new ArrayList<>()).build(); // Empty members
        Board board = Board.builder().project(project).build();
        Task task = Task.builder().board(board).build();
        task.setId(taskId);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            taskService.assignTask(taskId, assigneeId, currentUser);
        });
    }
}