package com.tinyjira.kanban.DTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class CreateCommentRequest {
    @NotBlank
    private String content;
    
    private List<MultipartFile> files;
}
