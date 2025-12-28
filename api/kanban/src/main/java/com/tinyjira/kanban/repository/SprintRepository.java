package com.tinyjira.kanban.repository;

import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.utils.SprintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
    
    @Query("SELECT s.name FROM Sprint s WHERE s.board.id = :boardId ORDER BY s.id DESC LIMIT 1")
    Optional<String> findLastSprintNameByBoardId(@Param("boardId") Long boardId);
    
    long countByBoardId(Long boardId);
    
    List<Sprint> findByBoardIdAndStatusNot(Long boardId, SprintStatus status);
    
    @Query("SELECT s FROM Sprint s WHERE s.board.id = :boardId AND s.status = :status")
    Optional<Sprint> findActiveSprintByBoardId(
            @Param("boardId") Long boardId,
            @Param("status") SprintStatus status
    );
    
}
