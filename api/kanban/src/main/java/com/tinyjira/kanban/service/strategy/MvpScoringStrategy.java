package com.tinyjira.kanban.service.strategy;

import com.tinyjira.kanban.model.User;

import java.util.Optional;

public interface MvpScoringStrategy {
    Optional<User> findTopPerformer(Long sprintId);
}