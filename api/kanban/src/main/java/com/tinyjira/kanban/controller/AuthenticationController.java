package com.tinyjira.kanban.controller;

import com.nimbusds.jose.JOSEException;
import com.tinyjira.kanban.DTO.request.LoginRequest;
import com.tinyjira.kanban.DTO.response.LoginResponse;
import com.tinyjira.kanban.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/auth")
@Slf4j(topic = "AUTHENTICATION-CONTROLLER")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequest request) throws JOSEException {
        LoginResponse loginResponse = authenticationService.login(request);
        return ResponseEntity.ok(loginResponse);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) throws ParseException {
        String token = authHeader.replace("Bearer ", "");
        authenticationService.logout(token);
        return ResponseEntity.ok().build();
    }
    
    
}
