package com.campusconnect.dto.component1;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String status;
    private Long campusId;
    private Long facultyId;
    private Long programId;
    private Long batchId;
    private Long semesterId;
    
}
