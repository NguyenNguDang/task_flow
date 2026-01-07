package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.request.RegisterRequest;
import com.tinyjira.kanban.DTO.request.UpdateProfileRequest;
import com.tinyjira.kanban.DTO.response.RegisterResponse;
import com.tinyjira.kanban.DTO.response.UserDetailResponse;
import com.tinyjira.kanban.model.User;
import jakarta.validation.Valid;

public interface UserService {
    RegisterResponse createUser(RegisterRequest registerRequest);
    
    void executeUpdates(User currentUser, @Valid UpdateProfileRequest req);
    
    UserDetailResponse getMyProfile(String email);
}
