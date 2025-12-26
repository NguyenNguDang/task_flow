package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ProjectStatus {
    @JsonProperty("active")
    ACTIVE,
    @JsonProperty("inactive")
    INACTIVE,
    @JsonProperty("none")
    NONE
}
