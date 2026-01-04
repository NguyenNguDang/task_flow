package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.request.RegisterRequest;
import com.tinyjira.kanban.DTO.request.UpdateProfileRequest;
import com.tinyjira.kanban.DTO.response.RegisterResponse;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.UserRepository;
import com.tinyjira.kanban.service.UserService;
import com.tinyjira.kanban.service.command.ChangePasswordCommand;
import com.tinyjira.kanban.service.command.UpdateAvatarCommand;
import com.tinyjira.kanban.service.command.UpdateBioCommand;
import com.tinyjira.kanban.service.command.UpdateProfileCommand;
import com.tinyjira.kanban.service.strategy.FileStorageStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageStrategy fileStorageStrategy;
    
    
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
    
    @Override
    public void executeUpdates(User currentUser, UpdateProfileRequest request) {
        List<UpdateProfileCommand> commands = new ArrayList<>();
        
        if (request.getBio() != null) {
            commands.add(new UpdateBioCommand(request.getBio()));
        }
        
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            try {
                commands.add(UpdateAvatarCommand.builder()
                        .fileName(request.getAvatarFile().getOriginalFilename())
                        .fileData(request.getAvatarFile().getBytes())
                        .storageStrategy(fileStorageStrategy)
                        .build());
                
            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi đọc file avatar", e);
            }
        }
        
        if (request.getNewPassword() != null) {
            commands.add(new ChangePasswordCommand(
                    request.getOldPassword(),
                    request.getNewPassword(),
                    passwordEncoder
            ));
        }
        
        for (UpdateProfileCommand cmd : commands) {
            cmd.execute(currentUser);
        }
        userRepository.save(currentUser);
    }
}
