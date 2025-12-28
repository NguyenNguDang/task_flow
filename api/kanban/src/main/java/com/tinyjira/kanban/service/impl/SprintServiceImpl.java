package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.service.SprintService;
import com.tinyjira.kanban.utils.SprintStatus;
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
    public void completeSprint(Long id) {
        Sprint sprint = getSprintById(id);
        sprint.complete();
        sprintRepository.save(sprint);
       
    }
    
    @Override
    public void startSprint(Long id) {
        Sprint sprint = getSprintById(id);
        sprint.start();
        sprintRepository.save(sprint);
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
