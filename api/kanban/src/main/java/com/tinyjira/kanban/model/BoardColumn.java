package com.tinyjira.kanban.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_board_column")
public class BoardColumn extends AbstractEntity<Long> {
    private String title;
    
    private int columnOrder;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;
    
    @OneToMany(mappedBy = "boardColumn", cascade = CascadeType.ALL)
    @OrderBy("position ASC")
    private Set<Task> tasks = new HashSet<>();
    
    public BoardColumn(String title, int order, Board board) {
        super();
        if (board == null) {
            throw new IllegalArgumentException("Board cannot be null when creating a column.");
        }
        
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Column title cannot be empty.");
        }
        
        if (order < 0) {
            throw new IllegalArgumentException("Column order cannot be negative.");
        }
        this.title = title;
        this.columnOrder = order;
        this.board = board;
    }
    
    @JsonValue
    public Map<String, Object> toJson() {
        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("id", this.getId());
        jsonMap.put("title", title);
        jsonMap.put("column_order", columnOrder);
        return jsonMap;
    }
}
