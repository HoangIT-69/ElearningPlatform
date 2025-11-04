package com.example.elearning.dto.response;

import com.example.elearning.enums.Role;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private String bio;
    private Role role;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
}