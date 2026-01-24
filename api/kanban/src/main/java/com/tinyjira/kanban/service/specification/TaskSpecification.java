package com.tinyjira.kanban.service.specification;

import com.tinyjira.kanban.model.Task;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {
    public static Specification<Task> titleContains(String title){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
}
