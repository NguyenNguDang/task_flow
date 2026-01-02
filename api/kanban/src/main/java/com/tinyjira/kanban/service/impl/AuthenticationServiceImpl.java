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
        
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
    
    @Override
    public void logout(String token) throws ParseException {
        JwtInfor jwtInfor = jwtService.parseToken(token);
        String jwtId = jwtInfor.getJwtId();
        Date issueTime = jwtInfor.getIssueTime();
        Date expiredTime = jwtInfor.getExpiredTime();
        
        if (expiredTime.after(new Date())) {
            RedisToken redisToken = RedisToken.builder()
                    .jwtId(jwtId)
                    .expiredTime(expiredTime.getTime() - issueTime.getTime())
                    .build();
            redisTokenRepository.delete(redisToken);
            log.info("Logout success!");
        }
    }
}
