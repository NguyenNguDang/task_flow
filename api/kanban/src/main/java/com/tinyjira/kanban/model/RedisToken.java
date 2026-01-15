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
@RedisHash("RedisToken")
public class RedisToken {
    @Id
    private String id; // Use 'id' as the key in Redis
    
    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private Long expiredTime;
}
