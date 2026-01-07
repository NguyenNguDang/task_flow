package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;
import com.tinyjira.kanban.model.User;


import java.nio.file.AccessDeniedException;
import java.util.List;

public interface TaskService {
    void moveTask(Long taskId, Long targetColumnId, int newIndex);
    
    List<TaskDetailResponse> getTasksByBoardId( Long boardId);
    
    List<TaskDetailResponse> getTasksInActiveSprint(Long boardId);
    
    TaskDetailResponse createTask(TaskRequest taskRequest);
    
    void assignTask(Long taskId, Long assigneeId, User currentUser) throws AccessDeniedException;
    
    void estimateTask(Long taskId, Double hours);
}
