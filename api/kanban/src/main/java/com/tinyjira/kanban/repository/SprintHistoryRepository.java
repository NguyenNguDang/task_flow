package com.tinyjira.kanban.repository;

import com.tinyjira.kanban.model.SprintHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SprintHistoryRepository extends JpaRepository<SprintHistory, Long> {
    Optional<SprintHistory> findBySprintIdAndRecordDate(Long sprintId, LocalDate recordDate);
    
    List<SprintHistory> findBySprintIdOrderByRecordDateAsc(Long sprintId);

    boolean existsBySprintIdAndRecordDate(Long sprintId, LocalDate recordDate);
}
