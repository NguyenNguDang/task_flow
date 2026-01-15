package com.tinyjira.kanban.service.strategy.impl;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.strategy.MvpScoringStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TaskCountMvpScoringStrategy implements MvpScoringStrategy {
    private final TaskRepository taskRepository;

    @Override
    public Optional<User> findTopPerformer(Long sprintId) {
        List<User> topUsers = taskRepository.findTopPerformersByTaskCount(sprintId, PageRequest.of(0, 1));
        return topUsers.isEmpty() ? Optional.empty() : Optional.of(topUsers.get(0));
    }
}
