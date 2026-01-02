package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.RegisterRequest;
import com.tinyjira.kanban.DTO.response.RegisterResponse;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    
    @Override
    public RegisterResponse createUser(RegisterRequest req) {
        if(userRepository.existsByEmail(req.getEmail())){
            throw new BadCredentialsException("Email already in use");
        }
        
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .build();
        userRepository.save(user);
        
        return RegisterResponse.builder().email(user.getEmail()).build();
    }
}
