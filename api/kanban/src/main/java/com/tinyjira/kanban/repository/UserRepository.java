package com.tinyjira.kanban.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.tinyjira.kanban.model.User;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    
    Optional<User> findByEmail(String username);

    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN ProjectMember pm ON u.id = pm.user.id " +
           "LEFT JOIN Project p ON p.owner.id = u.id " +
           "WHERE (pm.project.id = :projectId) OR (p.id = :projectId)")
    List<User> findUsersByProjectId(@Param("projectId") Long projectId);
}
