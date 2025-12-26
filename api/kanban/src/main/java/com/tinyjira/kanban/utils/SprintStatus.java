package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SprintStatus {
    @JsonProperty("planning")
    PLANNING,
    @JsonProperty("active")
    ACTIVE,
    @JsonProperty("completed")
    COMPLETED,
}
