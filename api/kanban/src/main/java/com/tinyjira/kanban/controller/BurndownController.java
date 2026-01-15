package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.response.BurndownChartResponse;
import com.tinyjira.kanban.service.BurndownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sprints/{sprintId}/burndown")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BurndownController {
    
    private final BurndownService burndownService;
    
    @GetMapping
    public ResponseEntity<BurndownChartResponse> getBurndownChart(@PathVariable Long sprintId) {
        return ResponseEntity.ok(burndownService.getBurndownData(sprintId));
    }
}