package com.tinyjira.kanban.model;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_board")
public class Board extends AbstractEntity<Long> {

    private String title;

    private String description;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant lastUpdatedOn;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private Set<BoardColumn> columns = new HashSet<>();
    
    public Board(String title, String description) {
        super();
        this.title = title;
        this.description = description;
    }
}
