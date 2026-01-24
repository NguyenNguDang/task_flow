package com.tinyjira.kanban.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.tinyjira.kanban.DTO.TaskStatusCount;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.utils.TaskStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tinyjira.kanban.model.Task;

public interface TaskRepository extends CrudRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    
    List<Task> findByBoardColumnOrderByPositionAsc(BoardColumn boardColumn);
    
    @Query("SELECT t FROM Task t " +
            "LEFT JOIN FETCH t.sprint " +
            "LEFT JOIN FETCH t.boardColumn " +
            "LEFT JOIN FETCH t.users " +
            "WHERE t.board.id = :boardId")
    List<Task> findByBoardId(@Param("boardId") Long boardId);
    
    @Query("SELECT t FROM Task t " +
            "LEFT JOIN FETCH t.sprint " +
            "LEFT JOIN FETCH t.boardColumn " +
            "LEFT JOIN FETCH t.users " +
            "WHERE t.sprint.id = :sprintId")
    List<Task> findBySprintId(@Param("sprintId") Long sprintId);
    
    @Query("SELECT MAX(t.position) FROM Task t WHERE t.boardColumn.id = :columnId")
    Double findMaxPositionByBoardColumnId(Long columnId);
    
    @Query("SELECT new com.tinyjira.kanban.DTO.TaskStatusCount(t.status, COUNT(t)) " +
            "FROM Task t " +
            "WHERE t.board.project.id = :projectId " +
            "GROUP BY t.status")
    List<TaskStatusCount> countTasksByStatus(@Param("projectId") Long projectId);
    
    long countBySprintId(Long sprintId);
    
    @Query("SELECT COUNT(t) FROM Task t " +
            "WHERE t.sprint.id = :sprintId " +
            "AND t.status <> 'DONE' " +
            "AND t.dueDate < CURRENT_TIMESTAMP")
    long countOverdueTasks(@Param("sprintId") Long sprintId);
    
    @Query("SELECT t.assignee FROM Task t " +
            "WHERE t.sprint.id = :sprintId AND t.status = 'DONE' " +
            "GROUP BY t.assignee " +
            "ORDER BY COUNT(t) DESC")
    List<User> findTopPerformersByTaskCount(@Param("sprintId") Long sprintId, Pageable pageable);
    
    long countBySprintIdAndStatus(Long sprintId, TaskStatus taskStatus);

    // --- Summary Queries ---

    // 1. Stats
    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.project.id = :projectId AND t.status = 'DONE' AND t.updatedAt >= :since")
    long countDoneTasksSince(@Param("projectId") Long projectId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.project.id = :projectId AND t.updatedAt >= :since")
    long countUpdatedTasksSince(@Param("projectId") Long projectId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.project.id = :projectId AND t.createdAt >= :since")
    long countCreatedTasksSince(@Param("projectId") Long projectId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.project.id = :projectId AND t.dueDate BETWEEN :now AND :dueLimit AND t.status <> 'DONE'")
    long countDueSoonTasks(@Param("projectId") Long projectId, @Param("now") LocalDateTime now, @Param("dueLimit") LocalDateTime dueLimit);

    // 2. Priority Breakdown
    @Query("SELECT t.priority, COUNT(t) FROM Task t WHERE t.board.project.id = :projectId GROUP BY t.priority")
    List<Object[]> countTasksByPriority(@Param("projectId") Long projectId);

    // 3. Workload (Assignee Breakdown)
    @Query("SELECT t.assignee, COUNT(t) FROM Task t WHERE t.board.project.id = :projectId GROUP BY t.assignee")
    List<Object[]> countTasksByAssignee(@Param("projectId") Long projectId);
    
    // 4. Total tasks in project
    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.project.id = :projectId")
    long countTotalTasksByProjectId(@Param("projectId") Long projectId);

    // --- Burndown Queries ---
    @Query("SELECT COALESCE(SUM(t.estimateHours), 0) FROM Task t WHERE t.sprint.id = :sprintId AND t.status <> 'DONE'")
    Double sumRemainingEstimateBySprintId(@Param("sprintId") Long sprintId);
}
