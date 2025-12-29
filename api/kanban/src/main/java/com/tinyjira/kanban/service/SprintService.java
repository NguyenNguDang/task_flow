package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;


import java.util.List;

public interface SprintService {
    SprintDTO createSprint (Long boardId);
    
    SprintDTO getSprint(Long id);
    
    void updateSprint(Long id, @Valid SprintRequest sprint);
    
    List<SprintDTO> getAllSprints();
    
    List<SprintDTO> getAllSprintsByBoardId(@Min(1) Long boardId);
    
    void completeSprint(@Min(1) Long id, Long targetSprintId);
    
    void startSprint(@Min(1) Long id);
    
}
