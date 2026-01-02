package com.tinyjira.kanban.controller;

import com.tinyjira.kanban.DTO.request.RegisterRequest;
import com.tinyjira.kanban.DTO.response.RegisterResponse;
import com.tinyjira.kanban.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/user")
@Slf4j(topic = "USER-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest req) {
        RegisterResponse response = userService.createUser(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    
}
