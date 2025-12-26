package com.tinyjira.kanban.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ProjectRole {
    @JsonProperty("admin")
    ADMIN,
    @JsonProperty("member")
    MEMBER,
    @JsonProperty("owner")
    OWNER,
    @JsonProperty("viewer")
    VIEWER
}
