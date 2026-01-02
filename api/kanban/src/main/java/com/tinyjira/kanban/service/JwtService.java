package com.tinyjira.kanban.service;

import com.nimbusds.jose.JOSEException;
import com.tinyjira.kanban.DTO.JwtInfor;
import com.tinyjira.kanban.model.User;

import java.text.ParseException;

public interface JwtService {
    String generateAccessToken(User user) throws JOSEException;
    String generateRefreshToken(User user) throws JOSEException;
    boolean verifyToken(String token) throws ParseException, JOSEException;
    JwtInfor parseToken(String token) throws ParseException;
}
