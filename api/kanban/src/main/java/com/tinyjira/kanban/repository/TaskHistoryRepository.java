package com.tinyjira.kanban.repository;

import com.tinyjira.kanban.model.TaskHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
    List<TaskHistory> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    @Query("SELECT th FROM TaskHistory th " +
            "JOIN th.task t " +
            "WHERE t.board.project.id = :projectId " +
            "ORDER BY th.createdAt DESC")
    List<TaskHistory> findRecentActivitiesByProjectId(@Param("projectId") Long projectId, Pageable pageable);
}
