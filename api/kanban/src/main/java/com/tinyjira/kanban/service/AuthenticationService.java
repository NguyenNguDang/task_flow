package com.tinyjira.kanban.service;

import com.nimbusds.jose.JOSEException;
import com.tinyjira.kanban.DTO.request.LoginRequest;
import com.tinyjira.kanban.DTO.response.LoginResponse;

import java.text.ParseException;

public interface AuthenticationService {
    LoginResponse login(LoginRequest request) throws JOSEException;
    void logout(String token) throws ParseException;
}
