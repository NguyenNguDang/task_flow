package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.TaskHistoryResponse;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.User;

import java.util.List;

public interface TaskHistoryService {
    void logHistory(Task task, User user, String field, String oldValue, String newValue);
    List<TaskHistoryResponse> getHistoryByTaskId(Long taskId);
}
