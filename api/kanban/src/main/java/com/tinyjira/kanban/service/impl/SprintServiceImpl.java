package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.DTO.response.SprintReportResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.SprintService;
import com.tinyjira.kanban.service.strategy.MvpScoringStrategy;
import com.tinyjira.kanban.utils.SprintStatus;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
    
    
    @Override
    public SprintDTO createSprint(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        
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
    public void updateSprint(Long id, SprintRequest sprint) {
    
    }
    
    @Override
    public List<SprintDTO> getAllSprints() {
        List<Sprint> sprints = sprintRepository.findAll();
        return sprints.stream().map(this::toSprintDTO).toList();
    }
    
    @Override
    public List<SprintDTO> getAllSprintsByBoardId(Long boardId) {
        List<Sprint> sprints = sprintRepository.findByBoardIdAndStatusNot(boardId, SprintStatus.COMPLETED);
        return sprints.stream().map(this::toSprintDTO).toList();
    }
    
    @Override
    public void completeSprint(Long sprintId, Long targetSprintId) {
        Sprint sprint = getSprintById(sprintId);
        Sprint targetSprint = getSprintById(targetSprintId);
        
        List<Task> allTasksInSprint = taskRepository.findBySprintId(sprintId);
        sprint.complete();
        sprint.rolloverUnfinishedTasks(allTasksInSprint, targetSprint);
        sprintRepository.save(sprint);
    }
    
    @Override
    public void startSprint(Long id) {
        Sprint sprint = getSprintById(id);
        sprint.start();
        sprintRepository.save(sprint);
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
