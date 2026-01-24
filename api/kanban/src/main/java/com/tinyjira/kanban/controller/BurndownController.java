package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.response.BurndownChartResponse;
import com.tinyjira.kanban.service.BurndownService;
import com.tinyjira.kanban.service.scheduler.BurndownScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sprints")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BurndownController {
    
    private final BurndownService burndownService;
    private final BurndownScheduler burndownScheduler;
    
    @GetMapping("/{sprintId}/burndown")
    public ResponseEntity<BurndownChartResponse> getBurndownChart(@PathVariable Long sprintId) {
        return ResponseEntity.ok(burndownService.getBurndownData(sprintId));
    }

    // API Test: Kích hoạt ghi dữ liệu ngay lập tức
    @PostMapping("/trigger-burndown-snapshot")
    public ResponseEntity<String> triggerSnapshot() {
        burndownScheduler.recordBurndownData();
        return ResponseEntity.ok("Burndown snapshot triggered successfully!");
    }
}
