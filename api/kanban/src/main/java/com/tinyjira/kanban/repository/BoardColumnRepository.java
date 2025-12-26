package com.tinyjira.kanban.repository;

import com.tinyjira.kanban.model.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardColumnRepository extends JpaRepository<BoardColumn, Long> {
    List<BoardColumn> findByBoardIdOrderByColumnOrderAsc(Long boardId);
    
    @Query("SELECT COALESCE(MAX(c.columnOrder), 0) FROM BoardColumn c WHERE c.board.id = :boardId")
    Integer findMaxOrderByBoardId(@Param("boardId") Long boardId);
}
