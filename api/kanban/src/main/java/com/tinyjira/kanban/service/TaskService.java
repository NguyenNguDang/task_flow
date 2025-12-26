package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.TaskRequest;
import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.DTO.response.TaskDetailResponse;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.List;

public interface TaskService {
    void moveTask(Long taskId, Long targetColumnId, int newIndex);
    
    List<TaskDetailResponse> getTasksByBoardId(@Min(1) Long boardId);
    
    List<TaskDetailResponse> getTasksInActiveSprint(Long boardId);
    
    TaskDetailResponse createTask(@Valid TaskRequest taskRequest);
    
}
