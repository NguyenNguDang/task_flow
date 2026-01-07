package com.tinyjira.kanban.event;

import com.tinyjira.kanban.model.SprintHistory;
import com.tinyjira.kanban.repository.SprintHistoryRepository;
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
    
    @EventListener
    @Async
    public void handleEstimationUpdate(TaskEstimationUpdatedEvent event) {
        System.out.printf("LOG: Task %d trong Sprint %d thay đổi ước lượng từ %.1f -> %.1f%n",
                event.getTaskId(), event.getSprintId(), event.getOldEstimate(), event.getNewEstimate());
        
        SprintHistory history = SprintHistory.builder()
                .build();
        
        sprintHistoryRepository.save(history);
    }
}
