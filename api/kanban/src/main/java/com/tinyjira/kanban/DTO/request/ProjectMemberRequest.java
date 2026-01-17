package com.tinyjira.kanban.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMemberRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Email is required")
    private String email;
}
