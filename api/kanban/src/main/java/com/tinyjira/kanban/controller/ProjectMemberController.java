package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.request.ProjectMemberRequest;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
                                              @AuthenticationPrincipal User inviter) {
        projectMemberService.inviteMember(request.getProjectId(), request.getEmail(), inviter);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/leave")
    public ResponseEntity<?> leaveProject(@RequestBody @Valid ProjectMemberRequest request,
                                          @AuthenticationPrincipal User currentUser){
        projectMemberService.leaveProject(request.getProjectId(), currentUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{projectId}/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long projectId,
                                          @PathVariable Long userId,
                                          @AuthenticationPrincipal User requester) {
        projectMemberService.removeMember(projectId, userId, requester);
        return ResponseEntity.ok().build();
    }
}
