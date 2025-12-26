package com.tinyjira.kanban.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class AbstractEntity<T> {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private T id;
}
