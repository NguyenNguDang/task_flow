package com.tinyjira.kanban.DTO.response;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserInfor user;
    
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
     public static class UserInfor{
        private Long id;
        private String name;
        private String email;
        private String avatarUrl;
    }
}
