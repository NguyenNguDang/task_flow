package com.tinyjira.kanban.DTO.request;

import lombok.Getter;

@Getter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
}
