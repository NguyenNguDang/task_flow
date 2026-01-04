package com.tinyjira.kanban.DTO.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileRequest {
    private String bio;
    private String oldPassword;
    private String newPassword;
    private MultipartFile avatarFile;
}
