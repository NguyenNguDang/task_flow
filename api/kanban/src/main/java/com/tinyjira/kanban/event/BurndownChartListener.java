package com.tinyjira.kanban.event;

import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.model.SprintHistory;
import com.tinyjira.kanban.repository.SprintHistoryRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class BurndownChartListener {
    
    private final SprintHistoryRepository sprintHistoryRepository;
    private final SprintRepository sprintRepository;
    
    @EventListener
    @Async
    public void handleEstimationUpdate(TaskEstimationUpdatedEvent event) {
        System.out.printf("LOG: Task %d trong Sprint %d thay đổi ước lượng từ %.1f -> %.1f%n",
                event.getTaskId(), event.getSprintId(), event.getOldEstimate(), event.getNewEstimate());
        
        // Tìm Sprint để set vào history
        Sprint sprint = sprintRepository.findById(event.getSprintId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        
        SprintHistory history = SprintHistory.builder()
                .sprint(sprint)
                .recordDate(LocalDate.now()) // Fix lỗi: Set ngày hiện tại
                .remainingHours(event.getNewEstimate()) // Tạm thời lưu estimate mới của task (Cần logic tính tổng chuẩn hơn sau này)
                .completedHours(0.0) // Tạm thời để 0
                .build();
        
        sprintHistoryRepository.save(history);
    }
}
