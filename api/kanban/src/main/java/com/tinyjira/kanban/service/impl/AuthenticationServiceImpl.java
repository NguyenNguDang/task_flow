package com.tinyjira.kanban.service.impl;

import com.nimbusds.jose.JOSEException;
import com.tinyjira.kanban.DTO.JwtInfor;
import com.tinyjira.kanban.DTO.request.LoginRequest;
import com.tinyjira.kanban.DTO.response.LoginResponse;
import com.tinyjira.kanban.model.RedisToken;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.RedisTokenRepository;
import com.tinyjira.kanban.service.AuthenticationService;
import com.tinyjira.kanban.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RedisTokenRepository redisTokenRepository;
    
    @Override
    public LoginResponse login(LoginRequest request) throws JOSEException {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        
        User user = (User) authentication.getPrincipal();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        LoginResponse.UserInfor userResponse =  LoginResponse.UserInfor.builder()
                .email(user.getEmail())
                .id(user.getId())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .build();
        
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }
    
    @Override
    public void logout(String token) throws ParseException {
        try {
            JwtInfor jwtInfor = jwtService.parseToken(token);
            String jwtId = jwtInfor.getJwtId();
            Date expiredTime = jwtInfor.getExpiredTime();
            
            if (expiredTime.after(new Date())) {
                long ttl = expiredTime.getTime() - System.currentTimeMillis();
                if (ttl > 0) {
                    RedisToken redisToken = RedisToken.builder()
                            .id(jwtId)
                            .expiredTime(ttl)
                            .build();
                    
                    redisTokenRepository.save(redisToken);
                    log.info("User logged out. Token JTI: {} added to blacklist", jwtId);
                }
            }
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
        }
    }
}
