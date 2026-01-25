package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    TODO,
    DOING,
    DONE;

    @JsonCreator
    public static TaskStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        return TaskStatus.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toString() {
        return name();
    }
}
