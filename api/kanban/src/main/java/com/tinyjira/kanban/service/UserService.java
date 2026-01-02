package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.RegisterRequest;
import com.tinyjira.kanban.DTO.response.RegisterResponse;

public interface UserService {
    RegisterResponse createUser(RegisterRequest registerRequest);
}
