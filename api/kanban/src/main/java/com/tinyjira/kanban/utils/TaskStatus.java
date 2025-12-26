package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TaskStatus {
    @JsonProperty("todo")
    TODO,
    @JsonProperty("doing")
    DOING,
    @JsonProperty("done")
    DONE,
}
