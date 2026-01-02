package com.tinyjira.kanban.DTO;

import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtInfor implements Serializable {
    private String jwtId;
    private Date expiredTime;
    private Date issueTime;
    
}
