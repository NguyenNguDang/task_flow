package com.tinyjira.kanban.DTO.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDetailResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String avatarUrl;
    private String bio;
}