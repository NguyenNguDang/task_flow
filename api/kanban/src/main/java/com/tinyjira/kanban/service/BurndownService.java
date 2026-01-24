package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.BurndownChartResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.model.SprintHistory;
import com.tinyjira.kanban.repository.SprintHistoryRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.repository.TaskRepository;
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
    private final TaskRepository taskRepository;
    
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
        
        // Lấy tổng estimate ban đầu từ bản ghi history đầu tiên, hoặc tính hiện tại nếu chưa có history
        double initialEffort = 0;
        if (!historyList.isEmpty()) {
            initialEffort = historyList.get(0).getRemainingHours();
        } else {
             // Fallback: Nếu chưa có history nào, lấy tổng hiện tại (trường hợp vừa tạo sprint chưa start hoặc lỗi)
             Double currentTotal = taskRepository.sumRemainingEstimateBySprintId(sprintId);
             initialEffort = currentTotal != null ? currentTotal : 0;
        }

        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(sprint.getStartDate(), sprint.getEndDate()) + 1;
        
        double idealBurnRate = (totalDays > 0) ? (initialEffort / (totalDays - 1)) : 0;
        
        LocalDateTime current = sprint.getStartDate();
        int dayIndex = 0;
        
        // Tính toán dữ liệu thực tế hiện tại (Real-time)
        Double currentRemaining = taskRepository.sumRemainingEstimateBySprintId(sprintId);
        if (currentRemaining == null) currentRemaining = 0.0;
        
        while (!current.isAfter(sprint.getEndDate())) {
            dates.add(current.toLocalDate().toString());
            
            // Ideal Line
            double idealVal = Math.max(0, initialEffort - (idealBurnRate * dayIndex));
            idealData.add(Math.round(idealVal * 10.0) / 10.0); 
            
            // Actual Line
            LocalDate dateKey = current.toLocalDate();
            if (!dateKey.isAfter(LocalDate.now())) {
                Double actualVal = historyMap.get(dateKey);
                
                // Nếu là ngày hôm nay, ưu tiên lấy dữ liệu realtime từ taskRepository
                // để phản ánh ngay lập tức thay đổi (Done task) lên biểu đồ
                if (dateKey.isEqual(LocalDate.now())) {
                    actualVal = currentRemaining;
                }
                
                // Nếu không có dữ liệu history cho ngày quá khứ, dùng dữ liệu của ngày trước đó (flat line)
                if (actualVal == null && !actualData.isEmpty()) {
                    actualVal = actualData.get(actualData.size() - 1);
                }
                
                // Nếu vẫn null (ngày đầu tiên mà chưa có history), dùng initialEffort
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
