package com.example.elearning.controller;

import com.example.elearning.dto.response.*;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.CourseService;
import com.example.elearning.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@Tag(name = "🎓 My Learning", description = "APIs cho các khóa học đã đăng ký")
@SecurityRequirement(name = "bearerAuth")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CourseService courseService;

    @Operation(summary = "Lấy danh sách các khóa học của tôi (đã đăng ký)")
    @GetMapping("/my-courses")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyEnrolledCourses(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<CourseResponse> courses = enrollmentService.getEnrolledCourses(currentUser);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @Operation(summary = "Lấy nội dung học của một khóa học cụ thể (Yêu cầu đã mua)")
    @GetMapping("/{slug}/content")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getEnrolledCourseContent(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        // Gọi hàm kiểm tra quyền và lấy dữ liệu trong CourseService
        CourseDetailResponse content = courseService.getEnrolledCourseContent(slug, currentUser);
        return ResponseEntity.ok(ApiResponse.success(content));
    }

    @Operation(summary = "Lấy danh sách học viên của một khóa học (cho Instructor/Admin)")
    @GetMapping("/course/{courseId}/students")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getStudentsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<UserResponse> students = enrollmentService.getStudentsOfCourse(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @Operation(summary = "Lấy các số liệu thống kê cho dashboard của người học")
    @GetMapping("/my-stats")
    public ResponseEntity<ApiResponse<UserDashboardStatsResponse>> getMyDashboardStats(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        UserDashboardStatsResponse stats = enrollmentService.getUserDashboardStats(currentUser);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}