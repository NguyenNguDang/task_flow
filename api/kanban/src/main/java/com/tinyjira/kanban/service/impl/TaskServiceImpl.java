package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.*;
import com.tinyjira.kanban.repository.*;
import com.tinyjira.kanban.service.TaskService;
import com.tinyjira.kanban.utils.SprintStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final ColumnRepository columnRepository;
    
    private static final double POSITION_GAP = 10000.0;
    private static final double MIN_POSITION = 0.0;
    private static final double MIN_GAP_THRESHOLD = 1.0;
    private final SprintRepository sprintRepository;
    private final BoardRepository boardRepository;
    private final BoardColumnRepository boardColumnRepository;
    
    @Override
    public void moveTask(Long taskId, Long targetColumnId, int newIndex) {
        
        Task taskToMove = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceAccessException("Task not found"));
        
        BoardColumn targetColumn = columnRepository.findById(targetColumnId)
                .orElseThrow(() -> new ResourceAccessException("Column not found"));
        
        List<Task> tasksInColumn = taskRepository.findByBoardColumnOrderByPositionAsc(targetColumn);
        
        System.out.println("Size trước khi xóa: " + tasksInColumn.size());

// 2. Thực hiện xóa với logic "bất tử"
        boolean removed = tasksInColumn.removeIf(t -> {
            String dbId = String.valueOf(t.getId()).trim(); // Lấy ID từ DB, ép về String, cắt khoảng trắng
            String inputId = String.valueOf(taskId).trim(); // Lấy ID input, ép về String, cắt khoảng trắng
            
            // Log ra từng thằng để bắt tận tay (Nếu list ngắn)
            // System.out.println("So sánh: [" + dbId + "] vs [" + inputId + "]");
            
            return dbId.equalsIgnoreCase(inputId);
        });

// 3. In kết quả
        System.out.println("Đã xóa được chưa? " + removed);
        System.out.println("Size sau khi xóa: " + tasksInColumn.size());
        double newPosition = calculateNewPosition(tasksInColumn, newIndex);
        
        taskToMove.setBoardColumn(targetColumn);
        taskToMove.setPosition(newPosition);
        taskRepository.save(taskToMove);
    }
    
    @Override
    public List<TaskDetailResponse> getTasksByBoardId(Long boardId) {
        List<Task> tasks = taskRepository.findByBoardId(boardId);
        
        return tasks.stream().map(this::toDto).toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TaskDetailResponse> getTasksInActiveSprint(Long boardId) {
        Optional<Sprint> activeSprintOpt = sprintRepository.findActiveSprintByBoardId(boardId, SprintStatus.ACTIVE);
        
        if (activeSprintOpt.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<Task> tasks = taskRepository.findBySprintId(activeSprintOpt.get().getId());
        return tasks.stream().map(this::toDto).toList();
    }
    
    @Override
    public TaskDetailResponse createTask(TaskRequest taskRequest) {
        Task task = toEntity(taskRequest);
        Double maxPosition = taskRepository.findMaxPositionByBoardColumnId(taskRequest.getColumnId());
        if (maxPosition == null) {
            task.setPosition(1000.0);
        } else {
            task.setPosition(maxPosition + 1000.0);
        }
        taskRepository.save(task);
        log.info("Created new task!");
        return toDto(task);
    }
    
    private double calculateNewPosition(List<Task> tasks, int index) {
        // column is empty
        if (tasks.isEmpty()) {
            return POSITION_GAP;
        }
        
        // first
        if (index <= 0) {
            double firstTaskPos = tasks.get(0).getPosition();
            if (firstTaskPos < MIN_GAP_THRESHOLD) {
                rebalanceColumn(tasks);
                firstTaskPos = tasks.get(0).getPosition();
            }
            return (MIN_POSITION + firstTaskPos) / 2;
        }
        
        // last
        if (index >= tasks.size()) {
            double lastTaskPos = tasks.get(tasks.size() - 1).getPosition();
            return lastTaskPos + POSITION_GAP;
        }
        
        // middle
        Task prevTask = tasks.get(index - 1);
        Task nextTask = tasks.get(index);
        
        double prevPos = prevTask.getPosition();
        double nextPos = nextTask.getPosition();
        
        if ((nextPos - prevPos) < MIN_GAP_THRESHOLD) {
            rebalanceColumn(tasks);
            prevPos = prevTask.getPosition();
            nextPos = nextTask.getPosition();
        }
        
        return (prevPos + nextPos) / 2;
    }
    
    private void rebalanceColumn(List<Task> tasks) {
        double currentPos = POSITION_GAP;
        for (Task t : tasks) {
            t.setPosition(currentPos);
            currentPos += POSITION_GAP;
        }
        taskRepository.saveAll(tasks);
    }
    
    private TaskDetailResponse toDto(Task task) {
        User assignee = null;
        int position = (task.getPosition() != null) ? task.getPosition().intValue() : 0;
        return TaskDetailResponse.builder()
                .id(task.getId())
                .boardColumnId(task.getBoardColumn() != null ? task.getBoardColumn().getId() : null)
                .sprintId(task.getSprint() != null ? task.getSprint().getId() : null)
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assigneeName(null)
                .position(position)
                .build();
    }
    
    private Task toEntity(TaskRequest taskRequest) {
        BoardColumn column = boardColumnRepository.findById(taskRequest.getColumnId())
            .orElseThrow(() -> new ResourceNotFoundException("Column not found!"));
        Board board = boardRepository.findById(taskRequest.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board not found!"));
        Sprint sprint = sprintRepository.findById(taskRequest.getSprintId())
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found!"));
        
        return Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .priority(taskRequest.getPriority())
                .boardColumn(column)
                .board(board)
                .sprint(sprint)
                .build();
    }
}
