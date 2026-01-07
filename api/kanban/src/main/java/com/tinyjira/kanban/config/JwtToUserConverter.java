package com.tinyjira.kanban.config;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtToUserConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    
    private final UserRepository userRepository;
    
    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String email = jwt.getSubject();
        
        User userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new UsernamePasswordAuthenticationToken(
                userEntity,
                jwt,
                userEntity.getAuthorities()
        );
    }
}