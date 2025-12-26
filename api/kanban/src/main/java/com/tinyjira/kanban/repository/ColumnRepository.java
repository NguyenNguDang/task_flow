package com.tinyjira.kanban.repository;

import java.util.List;

import com.tinyjira.kanban.model.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tinyjira.kanban.model.BoardColumn;

public interface ColumnRepository extends CrudRepository<BoardColumn, Long> {
    @Query(value = "SELECT * FROM tbl_board_column where board_id = :board_id", nativeQuery = true)
    public List<BoardColumn> findBoardColumns(@Param("board_id") Long boardId);

    @Query(value = "SELECT * FROM tbl_board_column  where id = :column_id", nativeQuery = true)
    public BoardColumn findBoardColumn(@Param("column_id") Long columnId);
    
    
}
