package com.tinyjira.kanban.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("RedisHas")
public class RedisToken {
    @Id
    private String jwtId;
    
    @TimeToLive(unit = TimeUnit.DAYS)
    private Long expiredTime;
}
