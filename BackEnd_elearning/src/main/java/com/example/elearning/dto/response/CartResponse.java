package com.example.elearning.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CartResponse {
    private Long courseId;
    private String courseTitle;
    private String courseSlug;
    private String courseThumbnail;
    private BigDecimal price;
    private String instructorName;
    private LocalDateTime addedAt;
}