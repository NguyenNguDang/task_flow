package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;
import com.tinyjira.kanban.DTO.response.SprintReportResponse;
import com.tinyjira.kanban.service.SprintService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/sprint")
@Slf4j(topic = "SPRINT-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class SprintController {
    private final SprintService sprintService;
    
    @GetMapping("/{sprintId}/report")
    public ResponseEntity<SprintReportResponse> getReport(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.getSprintReport(sprintId));
    }
    
    @PostMapping("/{boardId}")
    public ResponseEntity<SprintDTO> createSprint(@PathVariable @Min(1) Long boardId) {
        
        SprintDTO response = sprintService.createSprint(boardId);
        log.info("Sprint with created");
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSprint(@PathVariable Long id) {
        SprintDTO dto = sprintService.getSprint(id);
        
        log.info("Get Sprint with id {}", id);
        return ResponseEntity.ok(dto);
    }
    
    @GetMapping("/list")
    public ResponseEntity<?> getAllSprints() {
        List<SprintDTO> sprints = sprintService.getAllSprints();
        log.info("Get all sprints");
        return ResponseEntity.ok(sprints);
    }
    
    @GetMapping("/{boardId}/list")
    public ResponseEntity<?> getAllSprintsWithBoarId(@PathVariable @Min(1) Long boardId) {
        try {
            List<SprintDTO> sprints = sprintService.getAllSprintsByBoardId(boardId);
            log.info("Get all sprints with board id");
            return ResponseEntity.ok(sprints);
            
        } catch (Exception e) {
            log.error("getAllSprintsWithBoarId: ", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSprint(@RequestBody @Valid SprintRequest sprint,
                                        @PathVariable Long id) {
        sprintService.updateSprint(id, sprint);
        log.info("Update Sprint with id {}", id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeSprint(@PathVariable @Min(1) Long id,
                                            @RequestParam(required = false) Long targetSprintId) {
        sprintService.completeSprint(id, targetSprintId);
        log.info("Completed Sprint with id {}", id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/start")
    public ResponseEntity<?> startSprint(@PathVariable @Min(1) Long id) {
        sprintService.startSprint(id);
        log.info("Started Sprint with id {}", id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }
    
}
