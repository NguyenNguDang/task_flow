package com.tinyjira.kanban.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tinyjira.kanban.DTO.BoardDTO1;
import com.tinyjira.kanban.model.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query(value = "SELECT * FROM tbl_board", nativeQuery = true)
    List<Board> findAllBoards();

    @Query(value = "SELECT * FROM tbl_board where id = :board_id", nativeQuery = true)
    Board findBoard(@Param("board_id") Long id);
    
    @Query("SELECT DISTINCT b FROM Board b " +
            "LEFT JOIN FETCH b.columns c " +
            "LEFT JOIN FETCH c.tasks t " +
            "LEFT JOIN FETCH t.users u " +
            "WHERE b.id = :id")
    Optional<Board> findBoardFullDetail(@Param("id") Long id);
}