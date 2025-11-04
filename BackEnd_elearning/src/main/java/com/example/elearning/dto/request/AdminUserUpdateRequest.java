package com.example.elearning.dto.request;

import com.example.elearning.enums.Role;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true) // Kế thừa các trường từ UserUpdateRequest
public class AdminUserUpdateRequest extends UserUpdateProfileRequest {
    private Role role;
    private Boolean isActive;
    private Boolean emailVerified;
}