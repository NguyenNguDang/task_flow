package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.response.TaskHistoryResponse;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.TaskHistory;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.TaskHistoryRepository;
import com.tinyjira.kanban.service.TaskHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskHistoryServiceImpl implements TaskHistoryService {
    private final TaskHistoryRepository taskHistoryRepository;

    @Override
    @Transactional
    public void logHistory(Task task, User user, String field, String oldValue, String newValue) {
        TaskHistory history = TaskHistory.builder()
                .task(task)
                .user(user)
                .field(field)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        taskHistoryRepository.save(history);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskHistoryResponse> getHistoryByTaskId(Long taskId) {
        return taskHistoryRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(TaskHistoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
