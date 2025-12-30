package com.example.elearning.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class PopularInstructorResponse {
    private Long instructorId;
    private String fullName;
    private String avatar;
    private String bio;

    // Các chỉ số tổng hợp
    private long totalStudents;
    private BigDecimal averageRating;
    private long totalCourses;

    // Constructor để dễ dàng tạo đối tượng từ câu query
    public PopularInstructorResponse(Long instructorId, String fullName, String avatar, String bio, long totalStudents, Double averageRating, long totalCourses) {
        this.instructorId = instructorId;
        this.fullName = fullName;
        this.avatar = avatar;
        this.bio = bio;
        this.totalStudents = totalStudents;
        // Chuyển đổi Double sang BigDecimal một cách an toàn
        this.averageRating = (averageRating != null) ? BigDecimal.valueOf(averageRating).setScale(1, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO;
        this.totalCourses = totalCourses;
    }
}