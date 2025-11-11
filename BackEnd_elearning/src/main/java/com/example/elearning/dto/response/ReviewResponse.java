package com.example.elearning.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    // Thông tin người dùng đã viết review
    private Long userId;
    private String userFullName;
    private String userAvatar;
}