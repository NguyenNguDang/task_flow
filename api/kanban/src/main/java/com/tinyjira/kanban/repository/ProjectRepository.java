package com.tinyjira.kanban.repository;

import com.tinyjira.kanban.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByProjectKey(String key);
    
    @Query("SELECT DISTINCT p FROM Project p " +
            "LEFT JOIN p.members m " +
            "LEFT JOIN m.user u " +
            "WHERE p.owner.email = :email OR u.email = :email")
    Page<Project> findByUserEmail(@Param("email") String email, Pageable pageable);
}
