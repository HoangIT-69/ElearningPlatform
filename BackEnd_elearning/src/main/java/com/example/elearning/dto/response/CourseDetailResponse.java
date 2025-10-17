package com.example.elearning.dto.response;

import com.example.elearning.entity.Chapter; // <-- THÊM IMPORT
import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // <-- THÊM IMPORT

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailResponse {
    // --- Thông tin cơ bản của khóa học ---
    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String description;
    private String thumbnail;
    private String previewVideo;
    private CourseLevel level;
    private CourseStatus status;
    private BigDecimal price;
    private Boolean isFree;

    // --- Nội dung & Yêu cầu ---
    private String requirements;
    private String objectives;

    // --- Thống kê ---
    private Integer enrollmentCount;
    private BigDecimal averageRating;
    private Integer reviewCount;

    // --- Thông tin Giảng viên ---
    private Long instructorId;
    private String instructorName;
    private String instructorAvatar;
    private String instructorBio;

    // --- Thông tin thời gian ---
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ===============================================
    // CÁC TRƯỜNG MỚI ĐƯỢC THÊM VÀO
    // ===============================================

    /**
     * Danh sách đầy đủ các chương và bài học của khóa học.
     */
    private List<Chapter> chapters;

    /**
     * Tổng số bài học trong toàn bộ khóa học.
     */
    private Integer totalLessons;

    /**
     * Tổng thời lượng của tất cả các video trong khóa học (tính bằng giây).
     */
    private Integer totalDuration;
}