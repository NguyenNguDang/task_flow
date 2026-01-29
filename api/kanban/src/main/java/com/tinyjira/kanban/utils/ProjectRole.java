package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ProjectRole {
    @JsonProperty("project_manager")
    PROJECT_MANAGER,
    @JsonProperty("member")
    MEMBER,
    @JsonProperty("viewer")
    VIEWER
}
