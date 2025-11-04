package com.example.elearning.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateProfileRequest {
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2 đến 100 ký tự")
    private String fullName;

    @Size(max = 20, message = "Số điện thoại không hợp lệ")
    private String phone;

    private String avatar;

    @Size(max = 1000, message = "Giới thiệu không được vượt quá 1000 ký tự")
    private String bio;
}