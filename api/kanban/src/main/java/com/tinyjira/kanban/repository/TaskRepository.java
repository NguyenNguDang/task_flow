package com.tinyjira.kanban.repository;

import java.util.List;

import com.tinyjira.kanban.DTO.TaskStatusCount;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.utils.TaskStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tinyjira.kanban.model.Task;

public interface TaskRepository extends CrudRepository<Task, Long> {
    
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
}

