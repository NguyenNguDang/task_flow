package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.SubtaskDto;
import com.tinyjira.kanban.DTO.request.CreateSubtaskRequest;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Subtask;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.SubtaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubtaskServiceImpl implements SubtaskService {
    private final TaskRepository taskRepository;
    
    
    @Override
    @Transactional
    public SubtaskDto createSubtask(Long taskId, CreateSubtaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        task.addSubtask(request.getTitle());
        
        Task savedTask = taskRepository.save(task);
        Subtask newSubtask = savedTask.getSubtasks().get(savedTask.getSubtasks().size() - 1);
        return SubtaskDto.fromEntity(newSubtask);
    }
    
    @Override
    @Transactional
    public void toggleSubtaskStatus(Long taskId, Long subtaskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        // Tìm subtask trong list của Task
        task.getSubtasks().stream()
                .filter(s -> s.getId().equals(subtaskId))
                .findFirst()
                .ifPresent(s -> s.setCompleted(!s.isCompleted()));
        
        taskRepository.save(task);
    }

    @Override
    @Transactional
    public void deleteSubtask(Long taskId, Long subtaskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.removeSubtask(subtaskId);
        taskRepository.save(task);
    }
}
