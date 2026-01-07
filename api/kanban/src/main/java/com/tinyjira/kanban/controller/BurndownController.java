package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.response.BurndownChartResponse;
import com.tinyjira.kanban.service.BurndownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sprints/{sprintId}/burndown")
@RequiredArgsConstructor
public class BurndownController {
    
    private final BurndownService burndownService;
    
    @GetMapping
    public ResponseEntity<BurndownChartResponse> getBurndownChart(@PathVariable Long sprintId) {
        return ResponseEntity.ok(burndownService.getBurndownData(sprintId));
    }
}