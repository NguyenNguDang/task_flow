package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum NotificationType {
    @JsonProperty("assign")
    ASSIGN,
    @JsonProperty("comment")
    COMMENT,
    @JsonProperty("deadline")
    DEADLINE
}
