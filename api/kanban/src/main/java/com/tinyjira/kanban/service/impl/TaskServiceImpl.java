package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.event.TaskAssignedEvent;
import com.tinyjira.kanban.event.TaskEstimationUpdatedEvent;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.*;
import com.tinyjira.kanban.repository.*;
import com.tinyjira.kanban.security.annotation.RequireProjectRole;
import com.tinyjira.kanban.service.TaskHistoryService;
import com.tinyjira.kanban.service.TaskService;
import com.tinyjira.kanban.utils.Priority;
import com.tinyjira.kanban.utils.ProjectRole;
import com.tinyjira.kanban.utils.SprintStatus;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.ResourceAccessException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private final TaskHistoryService taskHistoryService;
    
    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER}, taskIdParam = "taskId")
    public void moveTask(Long taskId, Long targetColumnId, int newIndex) {
        
        Task taskToMove = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceAccessException("Task not found"));
        
        BoardColumn targetColumn = columnRepository.findById(targetColumnId)
                .orElseThrow(() -> new ResourceAccessException("Column not found"));
        
        List<Task> tasksInColumn = taskRepository.findByBoardColumnOrderByPositionAsc(targetColumn);
        
        tasksInColumn.removeIf(t -> t.getId().equals(taskId));
        
        double newPosition = calculateNewPosition(tasksInColumn, newIndex);
        
        taskToMove.setBoardColumn(targetColumn);
        taskToMove.setPosition(newPosition);
        taskRepository.save(taskToMove);
    }
    
    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER, ProjectRole.VIEWER}, boardIdParam = "boardId")
    public List<TaskDetailResponse> getTasksByBoardId(Long boardId) {
        List<Task> tasks = taskRepository.findByBoardId(boardId);
        
        return tasks.stream().map(this::toDto).toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER, ProjectRole.VIEWER}, boardIdParam = "boardId")
    public List<TaskDetailResponse> getTasksInActiveSprint(Long boardId) {
        Optional<Sprint> activeSprintOpt = sprintRepository.findActiveSprintByBoardId(boardId, SprintStatus.ACTIVE);
        
        if (activeSprintOpt.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<Task> tasks = taskRepository.findBySprintId(activeSprintOpt.get().getId());
        return tasks.stream().map(this::toDto).toList();
    }
    
    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER})
    public TaskDetailResponse createTask(TaskRequest taskRequest, User creator) {
        Task task = toEntity(taskRequest);
        log.info("due date and assigneeId {}, {}", taskRequest.getDueDate(), taskRequest.getAssigneeId());
        Double maxPosition = taskRepository.findMaxPositionByBoardColumnId(taskRequest.getColumnId());
        if (maxPosition == null) {
            task.setPosition(1000.0);
        } else {
            task.setPosition(maxPosition + 1000.0);
        }
        
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        } else {
            task.setStatus(TaskStatus.TODO);
        }
        
        task.setCreator(creator);
        task.setStartDate(LocalDateTime.now());
        
        if (taskRequest.getDueDate() != null) {
            task.setDueDate(taskRequest.getDueDate().atStartOfDay());
        }
        
        if (taskRequest.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskRequest.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }
        
        taskRepository.save(task);
        log.info("Created new task!");
        return toDto(task);
    }
    
    @Override
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER}, taskIdParam = "taskId")
    public void assignTask(Long taskId, Long assigneeId, User currentUser) throws AccessDeniedException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        if (!task.canBeAssignedBy(currentUser)) {
            throw new AccessDeniedException("Bạn không có quyền gán task này (Chỉ PM hoặc Creator)");
        }
        
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        boolean isMember = task.getBoard().getProject().hasMember(assignee);
        boolean isOwner = task.getBoard().getProject().getOwner().getId().equals(assignee.getId());

        if (!isMember && !isOwner) {
            throw new IllegalArgumentException("User này không thuộc dự án, vui lòng mời vào trước!");
        }
        
        User oldAssignee = task.getAssignee();
        String oldAssigneeName = oldAssignee != null ? oldAssignee.getName() : "Unassigned";
        
        task.assign(assignee);
        taskRepository.save(task);
        
        taskHistoryService.logHistory(task, currentUser, "assignee", oldAssigneeName, assignee.getName());
        
        eventPublisher.publishEvent(new TaskAssignedEvent(
                task.getTitle(),
                assignee.getEmail(),
                currentUser.getUsername(),
                task.getId()
        ));
    
    }
    
    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER}, taskIdParam = "taskId")
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
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER, ProjectRole.VIEWER}, taskIdParam = "id")
    public TaskDetailResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return TaskDetailResponse.fromEntity(task);
    }

    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER}, taskIdParam = "taskId")
    public void updateTask(Long taskId, Map<String, Object> updates, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        updates.forEach((key, value) -> {
            String oldValue = "";
            String newValue = String.valueOf(value);
            boolean changed = false;

            switch (key) {
                case "title":
                    if (!task.getTitle().equals(value)) {
                        oldValue = task.getTitle();
                        task.setTitle((String) value);
                        changed = true;
                    }
                    break;
                case "description":
                    if (task.getDescription() != null && !task.getDescription().equals(value)) {
                        oldValue = "Old Description";
                        task.setDescription((String) value);
                        newValue = "New Description";
                        changed = true;
                    } else if (task.getDescription() == null && value != null) {
                        oldValue = "Empty";
                        task.setDescription((String) value);
                        newValue = "New Description";
                        changed = true;
                    }
                    break;
                case "status":
                    if (!task.getStatus().name().equalsIgnoreCase((String) value)) {
                        oldValue = task.getStatus().name();
                        TaskStatus newStatus = TaskStatus.valueOf(((String) value).toUpperCase());
                        task.setStatus(newStatus);
                        newValue = newStatus.name();
                        changed = true;
                        
                        if (newStatus == TaskStatus.DONE) {
                            findColumnAndMoveTask(task, "done");
                        } else if (newStatus == TaskStatus.TODO) {
                             findColumnAndMoveTask(task, "todo");
                        } else if (newStatus == TaskStatus.DOING) {
                            findColumnAndMoveTask(task, "doing", "in progress");
                        }
                    }
                    break;
                case "priority":
                    if (!task.getPriority().name().equalsIgnoreCase((String) value)) {
                        oldValue = task.getPriority().name();
                        task.setPriority(Priority.valueOf(((String) value).toUpperCase()));
                        newValue = task.getPriority().name();
                        changed = true;
                    }
                    break;
                case "startDate":
                    if (value != null) {
                        LocalDate newDate = LocalDate.parse((String) value);
                        if (task.getStartDate() == null || !task.getStartDate().toLocalDate().equals(newDate)) {
                            oldValue = task.getStartDate() != null ? task.getStartDate().toLocalDate().toString() : "None";
                            task.setStartDate(newDate.atStartOfDay());
                            newValue = newDate.toString();
                            changed = true;
                        }
                    }
                    break;
                case "dueDate":
                    if (value != null) {
                        LocalDate newDate = LocalDate.parse((String) value);
                        if (task.getDueDate() == null || !task.getDueDate().toLocalDate().equals(newDate)) {
                            oldValue = task.getDueDate() != null ? task.getDueDate().toLocalDate().toString() : "None";
                            task.setDueDate(newDate.atStartOfDay());
                            newValue = newDate.toString();
                            changed = true;
                        }
                    }
                    break;
                case "estimateHours":
                    if (value != null) {
                        Double newEst = Double.valueOf(value.toString());
                        if (task.getEstimateHours() == null || !task.getEstimateHours().equals(newEst)) {
                            oldValue = task.getEstimateHours() != null ? task.getEstimateHours().toString() : "0";
                            estimateTask(taskId, newEst);
                            newValue = newEst.toString();
                            changed = true;
                        }
                    }
                    break;
                default:
                    log.warn("Unknown field to update: {}", key);
            }
            
            if (changed) {
                taskHistoryService.logHistory(task, currentUser, key, oldValue, newValue);
            }
        });

        taskRepository.save(task);
    }

    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER}, taskIdParam = "taskId")
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Override
    @Transactional
    @RequireProjectRole(value = {ProjectRole.PROJECT_MANAGER, ProjectRole.MEMBER}, taskIdParam = "taskId")
    public void moveTaskToSprint(Long taskId, Long sprintId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (sprintId == null) {
            task.setSprint(null);
        } else {
            Sprint sprint = sprintRepository.findById(sprintId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
            task.setSprint(sprint);
        }
        
        taskRepository.save(task);
    }
    
    private void findColumnAndMoveTask(Task task, String... columnTitles) {
        Board board = task.getBoard();
        Optional<BoardColumn> targetColumn = board.getColumns().stream()
                .filter(col -> {
                    String colTitle = col.getTitle().toLowerCase();
                    for (String title : columnTitles) {
                        if (colTitle.equals(title)) return true;
                    }
                    return false;
                })
                .findFirst();
        
        targetColumn.ifPresent(col -> {
            Double maxPos = taskRepository.findMaxPositionByBoardColumnId(col.getId());
            double newPos = (maxPos != null ? maxPos : 0.0) + POSITION_GAP;
            task.setBoardColumn(col);
            task.setPosition(newPos);
        });
    }
    
    private double calculateNewPosition(List<Task> tasks, int index) {
        if (tasks.isEmpty()) {
            return POSITION_GAP;
        }
        
        if (index <= 0) {
            double firstTaskPos = tasks.get(0).getPosition();
            if (firstTaskPos < MIN_GAP_THRESHOLD) {
                rebalanceColumn(tasks);
                firstTaskPos = tasks.get(0).getPosition();
            }
            return (MIN_POSITION + firstTaskPos) / 2;
        }
        
        if (index >= tasks.size()) {
            double lastTaskPos = tasks.get(tasks.size() - 1).getPosition();
            return lastTaskPos + POSITION_GAP;
        }
        
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
