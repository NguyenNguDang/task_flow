package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;

import java.util.List;

public interface TaskService {
    void moveTask(Long taskId, Long targetColumnId, int newIndex);
    
    List<TaskDetailResponse> getTasksByBoardId( Long boardId);
    
    List<TaskDetailResponse> getTasksInActiveSprint(Long boardId);
    
    TaskDetailResponse createTask(TaskRequest taskRequest);
    
}
