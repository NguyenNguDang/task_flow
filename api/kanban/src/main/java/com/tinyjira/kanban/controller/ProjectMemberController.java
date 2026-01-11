package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.request.ProjectMemberRequest;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.ProjectMemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/projects-member")
@Slf4j(topic = "PROJECT-MEMBER-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectMemberController {
    private final ProjectMemberService projectMemberService;
    
    @PostMapping("/add")
    public ResponseEntity<?> addProjectMember(@RequestBody @Valid ProjectMemberRequest request,
                                              @AuthenticationPrincipal User inviter) throws AccessDeniedException {
        projectMemberService.inviteMember(request.getProjectId(), request.getEmail(), inviter);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/leave")
    public ResponseEntity<?> leaveProject(@RequestBody @Valid ProjectMemberRequest request,
                                          @AuthenticationPrincipal User currentUser){
        projectMemberService.leaveProject(request.getProjectId(), currentUser);
        return ResponseEntity.ok().build();
    }
}
