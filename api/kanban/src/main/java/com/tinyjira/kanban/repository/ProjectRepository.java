package com.tinyjira.kanban.repository;

import com.tinyjira.kanban.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByProjectKey(String key);
}
