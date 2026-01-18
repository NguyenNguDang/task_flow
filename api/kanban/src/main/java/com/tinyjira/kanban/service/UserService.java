package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.RegisterRequest;
import com.tinyjira.kanban.DTO.request.UpdateProfileRequest;
import com.tinyjira.kanban.DTO.response.RegisterResponse;
import com.tinyjira.kanban.DTO.response.UserDetailResponse;
import com.tinyjira.kanban.model.User;
import jakarta.validation.Valid;

import java.io.IOException;

public interface UserService {
    RegisterResponse createUser(RegisterRequest registerRequest);
    
    UserDetailResponse executeUpdates(User currentUser, @Valid UpdateProfileRequest req) throws IOException;
    
    UserDetailResponse getMyProfile(String email);
}
