package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.event.TaskAssignedEvent;
import com.tinyjira.kanban.event.TaskEstimationUpdatedEvent;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.*;
import com.tinyjira.kanban.repository.*;
import com.tinyjira.kanban.service.TaskService;
import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.SprintStatus;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
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
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    
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
    
    @Override
    public void assignTask(Long taskId, Long assigneeId, User currentUser) throws AccessDeniedException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        if (!task.canBeAssignedBy(currentUser)) {
            throw new AccessDeniedException("Bạn không có quyền gán task này (Chỉ PM hoặc Creator)");
        }
        
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!task.getBoard().getProject().hasMember(assignee)) {
            throw new IllegalArgumentException("User này không thuộc dự án, vui lòng mời vào trước!");
        }
        
        task.assign(assignee);
        taskRepository.save(task);
        
        eventPublisher.publishEvent(new TaskAssignedEvent(
                task.getTitle(),
                assignee.getEmail(),
                currentUser.getUsername()
        ));
    
    }
    
    @Override
    @Transactional
    public void estimateTask(Long taskId, Double hours) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        Double oldEstimate = task.getEstimateHours();
        
        task.updateEstimation(hours);
        
        taskRepository.save(task);
        
        if (task.getSprint() != null) {
            eventPublisher.publishEvent(new TaskEstimationUpdatedEvent(
                    task.getId(),
                    task.getSprint().getId(),
                    task.getEstimateHours(),
                    oldEstimate,
                    LocalDateTime.now()
            ));
        }
    }
    
    @Override
    public TaskDetailResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return TaskDetailResponse.fromEntity(task);
    }

    @Override
    @Transactional
    public void updateTask(Long taskId, Map<String, Object> updates) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "title":
                    task.setTitle((String) value);
                    break;
                case "description":
                    task.setDescription((String) value);
                    break;
                case "status":
                    TaskStatus newStatus = TaskStatus.valueOf(((String) value).toUpperCase());
                    task.setStatus(newStatus);
                    
                    // Logic tự động chuyển cột khi status thay đổi
                    if (newStatus == TaskStatus.DONE) {
                        // Tìm cột DONE trong board hiện tại
                        Board board = task.getBoard();
                        Optional<BoardColumn> doneColumn = board.getColumns().stream()
                                .filter(col -> col.getTitle().equalsIgnoreCase("done"))
                                .findFirst();
                        
                        if (doneColumn.isPresent()) {
                            // Di chuyển task sang cột DONE
                            // Cần tính toán position mới (cuối cột)
                            Double maxPos = taskRepository.findMaxPositionByBoardColumnId(doneColumn.get().getId());
                            double newPos = (maxPos != null ? maxPos : 0.0) + POSITION_GAP;
                            
                            task.setBoardColumn(doneColumn.get());
                            task.setPosition(newPos);
                        }
                    } else if (newStatus == TaskStatus.TODO) {
                         // Tìm cột TODO
                        Board board = task.getBoard();
                        Optional<BoardColumn> todoColumn = board.getColumns().stream()
                                .filter(col -> col.getTitle().equalsIgnoreCase("to do") || col.getTitle().equalsIgnoreCase("todo"))
                                .findFirst();
                         if (todoColumn.isPresent()) {
                            Double maxPos = taskRepository.findMaxPositionByBoardColumnId(todoColumn.get().getId());
                            double newPos = (maxPos != null ? maxPos : 0.0) + POSITION_GAP;
                            task.setBoardColumn(todoColumn.get());
                            task.setPosition(newPos);
                        }
                    } else if (newStatus == TaskStatus.DOING) {
                        // Tìm cột DOING / IN PROGRESS
                        Board board = task.getBoard();
                        Optional<BoardColumn> doingColumn = board.getColumns().stream()
                                .filter(col -> col.getTitle().equalsIgnoreCase("doing") || col.getTitle().equalsIgnoreCase("in progress"))
                                .findFirst();
                        if (doingColumn.isPresent()) {
                            Double maxPos = taskRepository.findMaxPositionByBoardColumnId(doingColumn.get().getId());
                            double newPos = (maxPos != null ? maxPos : 0.0) + POSITION_GAP;
                            task.setBoardColumn(doingColumn.get());
                            task.setPosition(newPos);
                        }
                    }

                    break;
                case "priority":
                    task.setPriority(Priority.valueOf(((String) value).toUpperCase()));
                    break;
                case "startDate":
                    if (value != null) {
                        // Assuming format YYYY-MM-DD
                        task.setStartDate(LocalDate.parse((String) value).atStartOfDay());
                    }
                    break;
                case "dueDate":
                    if (value != null) {
                        task.setDueDate(LocalDate.parse((String) value).atStartOfDay());
                    }
                    break;
                case "estimateHours":
                    if (value != null) {
                        estimateTask(taskId, Double.valueOf(value.toString()));
                    }
                    break;
                default:
                    log.warn("Unknown field to update: {}", key);
            }
        });

        taskRepository.save(task);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    @Override
    @Transactional
    public void moveTaskToSprint(Long taskId, Long sprintId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (sprintId == null) {
            // Move to backlog
            task.setSprint(null);
        } else {
            Sprint sprint = sprintRepository.findById(sprintId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
            task.setSprint(sprint);
        }
        
        taskRepository.save(task);
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
        return TaskDetailResponse.fromEntity(task);
    }
    
    private Task toEntity(TaskRequest taskRequest) {
        BoardColumn column = boardColumnRepository.findById(taskRequest.getColumnId())
            .orElseThrow(() -> new ResourceNotFoundException("Column not found!"));
        Board board = boardRepository.findById(taskRequest.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board not found!"));
        
        Sprint sprint = null;
        if (taskRequest.getSprintId() != null) {
            sprint = sprintRepository.findById(taskRequest.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found!"));
        }

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
