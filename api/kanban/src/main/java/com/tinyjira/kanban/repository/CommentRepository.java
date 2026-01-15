package com.tinyjira.kanban.repository;

import org.springframework.data.repository.CrudRepository;

import com.tinyjira.kanban.model.Comment;

import java.util.List;

public interface CommentRepository extends CrudRepository<Comment, Long> {
    List<Comment> findByTaskIdOrderByCreatedOnDesc(Long taskId);
}
