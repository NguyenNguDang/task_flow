package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.DTO.response.SprintReportResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.*;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.SprintHistoryRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.SprintService;
import com.tinyjira.kanban.service.strategy.MvpScoringStrategy;
import com.tinyjira.kanban.utils.ProjectRole;
import com.tinyjira.kanban.utils.SprintStatus;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class SprintServiceImpl implements SprintService {
    private final SprintRepository sprintRepository;
    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;
    private final MvpScoringStrategy mvpScoringStrategy;
    private final SprintHistoryRepository sprintHistoryRepository;
    private final UserRepository userRepository;
    
    
    @Override
    public SprintDTO createSprint(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (board.getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to create sprint.");
        }
        
        String nextName = generateNextSprintName(boardId);
        
        Sprint sprint = Sprint.builder()
                .name(nextName)
                .status(SprintStatus.PLANNING)
                .board(board)
                .build();
        sprintRepository.save(sprint);
        
        return toSprintDTO(sprint);
    }
    
    @Override
    public SprintDTO getSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        return toSprintDTO(sprint);
    }
    
    @Override
    public void updateSprint(Long id, SprintRequest sprintRequest) {
        Sprint sprint = getSprintById(id);

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (sprint.getBoard().getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to update sprint.");
        }
        
        if (sprintRequest.getName() != null) {
            sprint.setName(sprintRequest.getName());
        }
        
        if (sprintRequest.getStartDate() != null) {
            sprint.setStartDate(sprintRequest.getStartDate().atStartOfDay());
        }
        
        if (sprintRequest.getEndDate() != null) {
            sprint.setEndDate(sprintRequest.getEndDate().atStartOfDay());
        }
        
        sprintRepository.save(sprint);
    }
    
    @Override
    public List<SprintDTO> getAllSprints() {
        List<Sprint> sprints = sprintRepository.findAll();
        return sprints.stream().map(this::toSprintDTO).toList();
    }
    
    @Override
    public List<SprintDTO> getAllSprintsByBoardId(Long boardId) {
        // Lấy tất cả sprint, bao gồm cả COMPLETED để hiển thị trong report
        return sprintRepository.findAll().stream()
                .filter(s -> s.getBoard().getId().equals(boardId))
                .map(this::toSprintDTO)
                .toList();
    }
    
    @Override
    public void completeSprint(Long sprintId, Long targetSprintId) {
        Sprint sprint = getSprintById(sprintId);

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (sprint.getBoard().getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to complete sprint.");
        }
        
        // targetSprintId có thể null nếu người dùng chọn chuyển về Backlog
        Sprint targetSprint = null;
        if (targetSprintId != null) {
            targetSprint = getSprintById(targetSprintId);
        }
        
        List<Task> allTasksInSprint = taskRepository.findBySprintId(sprintId);
        sprint.complete();
        sprint.rolloverUnfinishedTasks(allTasksInSprint, targetSprint);
        sprintRepository.save(sprint);
    }
    
    @Override
    public void startSprint(Long id) {
        Sprint sprint = getSprintById(id);

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (sprint.getBoard().getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to start sprint.");
        }

        sprint.start();
        sprintRepository.save(sprint);

        // Ghi lại lịch sử ban đầu cho Burndown Chart
        Double totalEstimate = taskRepository.sumRemainingEstimateBySprintId(id);
        if (totalEstimate == null) totalEstimate = 0.0;

        LocalDate today = LocalDate.now();
        
        // Kiểm tra xem đã có bản ghi cho ngày hôm nay chưa
        Optional<SprintHistory> existingHistory = sprintHistoryRepository.findBySprintIdAndRecordDate(id, today);
        
        if (existingHistory.isPresent()) {
            // Nếu đã có, cập nhật lại
            SprintHistory history = existingHistory.get();
            history.setRemainingHours(totalEstimate);
            sprintHistoryRepository.save(history);
        } else {
            // Nếu chưa có, tạo mới
            SprintHistory history = SprintHistory.builder()
                    .sprint(sprint)
                    .recordDate(today)
                    .remainingHours(totalEstimate)
                    .completedHours(0.0)
                    .build();
            sprintHistoryRepository.save(history);
        }
    }
    
    @Override
    public SprintReportResponse getSprintReport(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        long total = taskRepository.countBySprintId(sprintId);
        long overdue = taskRepository.countOverdueTasks(sprintId);
        
        // (Có thể đếm thêm số task DONE nếu cần)
        long completed = taskRepository.countBySprintIdAndStatus(sprintId, TaskStatus.DONE);
        
        User mvp = mvpScoringStrategy.findTopPerformer(sprintId).orElse(null);
        
        return SprintReportResponse.builder()
                .sprintId(sprint.getId())
                .sprintName(sprint.getName())
                .totalTasks(total)
                .completedTasks(completed)
                .overdueTasks(overdue)
                .mvpUser(ProjectDetailResponse.UserSummaryDto.fromEntity(mvp))
                .build();
    }

    @Override
    public void deleteSprint(Long id) {
        Sprint sprint = getSprintById(id);

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (sprint.getBoard().getProject().getRole(currentUser) != ProjectRole.PROJECT_MANAGER) {
            throw new AccessDeniedException("You do not have permission to delete sprint.");
        }

        // Logic: Move tasks to backlog before deleting? Or delete tasks?
        // Usually, tasks should be moved to backlog.
        List<Task> tasks = taskRepository.findBySprintId(id);
        for (Task task : tasks) {
            task.setSprint(null); // Move to backlog
            taskRepository.save(task);
        }
        sprintRepository.delete(sprint);
    }
    
    private Sprint getSprintById(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
    }
    
    private Sprint toSprint(SprintRequest request,  Board currentBoard ) {
        return Sprint.builder()
                .name(request.getName())
                .board(currentBoard)
                .status(SprintStatus.PLANNING)
                .build();
    }
    
    private SprintDTO toSprintDTO(Sprint sprint) {
        
        return SprintDTO.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .status(sprint.getStatus())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .build();
    }
    
    private String generateNextSprintName(Long boardId) {
        Optional<String> lastSprintNameOpt = sprintRepository.findLastSprintNameByBoardId(boardId);
        
        if (lastSprintNameOpt.isEmpty()) {
            return "Sprint 1";
        }
        
        String lastName = lastSprintNameOpt.get();
        
        try {
            java.util.regex.Pattern p = java.util.regex.Pattern.compile("(\\d+)$");
            java.util.regex.Matcher m = p.matcher(lastName);
            
            if (m.find()) {
                String numberStr = m.group(1);
                int number = Integer.parseInt(numberStr);
                int nextNumber = number + 1;
                return lastName.substring(0, lastName.length() - numberStr.length()) + nextNumber;
            } else {
                return "Sprint " + (sprintRepository.countByBoardId(boardId) + 1);
            }
        } catch (Exception e) {
            return "Sprint " + (sprintRepository.countByBoardId(boardId) + 1);
        }
    }
}
