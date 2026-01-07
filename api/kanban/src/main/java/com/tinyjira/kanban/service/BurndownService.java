package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.BurndownChartResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.model.SprintHistory;
import com.tinyjira.kanban.repository.SprintHistoryRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BurndownService {
    
    private final SprintRepository sprintRepository;
    private final SprintHistoryRepository sprintHistoryRepository;
    
    public BurndownChartResponse getBurndownData(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        if (sprint.getStartDate() == null || sprint.getEndDate() == null) {
            throw new IllegalArgumentException("Sprint chưa được cấu hình ngày bắt đầu/kết thúc");
        }
        
        List<SprintHistory> historyList = sprintHistoryRepository.findBySprintIdOrderByRecordDateAsc(sprintId);
        
        Map<LocalDate, Double> historyMap = historyList.stream()
                .collect(Collectors.toMap(SprintHistory::getRecordDate, SprintHistory::getRemainingHours));
        
        List<String> dates = new ArrayList<>();
        List<Double> idealData = new ArrayList<>();
        List<Double> actualData = new ArrayList<>();
        
        double initialEffort = historyList.isEmpty() ? 0 : historyList.get(0).getRemainingHours();
        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(sprint.getStartDate(), sprint.getEndDate()) + 1;
        
        double idealBurnRate = (totalDays > 0) ? (initialEffort / (totalDays - 1)) : 0;
        
        LocalDateTime current = sprint.getStartDate();
        int dayIndex = 0;
        
        while (!current.isAfter(sprint.getEndDate())) {
            dates.add(current.toString());
            
            double idealVal = Math.max(0, initialEffort - (idealBurnRate * dayIndex));
            idealData.add(Math.round(idealVal * 10.0) / 10.0); // Làm tròn 1 số lẻ
            
            if (!current.isAfter(LocalDate.now().atStartOfDay())) {
                Double actualVal = historyMap.getOrDefault(current, null);
                
                if (actualVal == null && !actualData.isEmpty()) {
                    actualVal = actualData.get(actualData.size() - 1);
                }
                
                if (actualVal == null) actualVal = initialEffort;
                
                actualData.add(actualVal);
            }
            
            current = current.plusDays(1);
            dayIndex++;
        }
        
        return BurndownChartResponse.builder()
                .dates(dates)
                .idealData(idealData)
                .actualData(actualData)
                .build();
    }
}