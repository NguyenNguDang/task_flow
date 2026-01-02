package com.tinyjira.kanban.service.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.tinyjira.kanban.DTO.JwtInfor;
import com.tinyjira.kanban.model.RedisToken;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.RedisTokenRepository;
import com.tinyjira.kanban.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final RedisTokenRepository redisTokenRepository;
    @Value("${jwt.secret-key}")
    private String secretKey;
    
    @Override
    public String generateAccessToken(User user) throws JOSEException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        
        Date issueTime = new Date();
        Date expiredTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.MINUTES));
        
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer(user.getUsername())
                .issueTime(issueTime)
                .expirationTime(expiredTime)
                .jwtID(UUID.randomUUID().toString())
                .build();
        
        Payload payload = new Payload(claimsSet.toJSONObject());
        
        JWSObject jwsObject = new JWSObject(header, payload);
        jwsObject.sign(new MACSigner(secretKey));
        return jwsObject.serialize();
    }
    
    @Override
    public String generateRefreshToken(User user) throws JOSEException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        
        Date issueTime = new Date();
        Date expiredTime = Date.from(issueTime.toInstant().plus(7, ChronoUnit.DAYS));
        
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer(user.getUsername())
                .issueTime(issueTime)
                .expirationTime(expiredTime)
                .jwtID(UUID.randomUUID().toString())
                .build();
        
        Payload payload = new Payload(claimsSet.toJSONObject());
        
        JWSObject jwsObject = new JWSObject(header, payload);
        jwsObject.sign(new MACSigner(secretKey));
        return jwsObject.serialize();
    }
    
    @Override
    public boolean verifyToken(String token) throws ParseException, JOSEException {
       
        SignedJWT signedJWT = SignedJWT.parse(token);
        //1. check expired time
        Date expiredTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        if(expiredTime.before(new Date())) {
            return false;
        }
        
        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
        Optional<RedisToken> byId = redisTokenRepository.findById(jwtId);
        if(byId.isPresent()) {
            throw new RuntimeException("Token invalid!");
        }
        return signedJWT.verify(new MACVerifier(secretKey));
    }
    
    @Override
    public JwtInfor parseToken(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiredTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Date issueTime = signedJWT.getJWTClaimsSet().getIssueTime();
        return JwtInfor.builder()
                .jwtId(jwtId)
                .expiredTime(expiredTime)
                .issueTime(issueTime)
                .build();
    }
    
}
