package com.example.elearning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboardStatsResponse {
    private long enrolledCourses;   // Tổng số khóa học đã đăng ký
    private long completedCourses;  // Tổng số khóa học đã hoàn thành
    private long totalLearningMinutes; // Tổng số phút học
    private long currentStreak;     // Chuỗi ngày học liên tiếp
}