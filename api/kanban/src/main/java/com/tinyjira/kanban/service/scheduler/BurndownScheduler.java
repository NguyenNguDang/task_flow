package com.tinyjira.kanban.service.scheduler;

import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.model.SprintHistory;
import com.tinyjira.kanban.repository.SprintHistoryRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.utils.SprintStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BurndownScheduler {

    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final SprintHistoryRepository sprintHistoryRepository;

    // Chạy vào 23:59 mỗi ngày
    @Scheduled(cron = "0 59 23 * * *")
    @Transactional
    public void recordBurndownData() {
        log.info("Starting daily burndown data recording...");
        
        // Lấy tất cả các sprint đang ACTIVE
        List<Sprint> activeSprints = sprintRepository.findAll().stream()
                .filter(s -> s.getStatus() == SprintStatus.ACTIVE)
                .toList();

        for (Sprint sprint : activeSprints) {
            try {
                Double remainingEstimate = taskRepository.sumRemainingEstimateBySprintId(sprint.getId());
                if (remainingEstimate == null) remainingEstimate = 0.0;

                // Kiểm tra xem hôm nay đã ghi chưa để tránh duplicate nếu chạy lại
                LocalDate today = LocalDate.now();
                boolean exists = sprintHistoryRepository.existsBySprintIdAndRecordDate(sprint.getId(), today);

                if (!exists) {
                    SprintHistory history = SprintHistory.builder()
                            .sprint(sprint)
                            .recordDate(today)
                            .remainingHours(remainingEstimate)
                            .completedHours(0.0) // Có thể tính thêm nếu cần
                            .build();
                    
                    sprintHistoryRepository.save(history);
                    log.info("Recorded burndown for sprint {}: {} hours remaining", sprint.getName(), remainingEstimate);
                }
            } catch (Exception e) {
                log.error("Failed to record burndown for sprint {}", sprint.getId(), e);
            }
        }
        
        log.info("Daily burndown recording completed.");
    }
}
