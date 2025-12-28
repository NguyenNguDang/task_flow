package com.tinyjira.kanban.repository;

import java.util.List;

import com.tinyjira.kanban.model.BoardColumn;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tinyjira.kanban.model.Task;

public interface TaskRepository extends CrudRepository<Task, Long> {

    @Query(value = "SELECT * FROM tbl_task where board_column_id = :column_id", nativeQuery = true)
    public List<Task> getAllColumnTasks(@Param("column_id") Long columnId);
    
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
}
