package com.tinyjira.kanban.DTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSubtaskRequest {
    @NotBlank(message = "Nội dung không được để trống")
    private String title;
}
