package com.example.elearning.dto.response;


import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;  // ← THÊM IMPORT
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String thumbnail;
    private CourseLevel level;
    private CourseStatus status;
    private BigDecimal price;  // ✅ BigDecimal
    private Boolean isFree;
    private Integer totalDuration;
    private Integer enrollmentCount;
    private BigDecimal averageRating;  // ✅ SỬA ĐÂY - Đổi từ Double
    private Integer reviewCount;
    private Long instructorId;
    private String instructorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer progress = 0;
}