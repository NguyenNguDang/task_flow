package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.SubtaskDto;
import com.tinyjira.kanban.DTO.request.CreateSubtaskRequest;

public interface SubtaskService {
    SubtaskDto createSubtask(Long taskId, CreateSubtaskRequest request);
    void toggleSubtaskStatus(Long taskId, Long subtaskId);
}
