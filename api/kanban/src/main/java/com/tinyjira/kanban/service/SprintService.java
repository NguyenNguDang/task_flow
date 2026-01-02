package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;

import java.util.List;

public interface SprintService {
    SprintDTO createSprint (Long boardId);
    
    SprintDTO getSprint(Long id);
    
    void updateSprint(Long id,  SprintRequest sprint);
    
    List<SprintDTO> getAllSprints();
    
    List<SprintDTO> getAllSprintsByBoardId( Long boardId);
    
}
