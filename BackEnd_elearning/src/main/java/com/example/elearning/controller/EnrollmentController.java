package com.example.elearning.controller;

import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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

    @Operation(summary = "Lấy danh sách các khóa học của tôi (đã đăng ký)")
    @GetMapping("/my-courses")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyEnrolledCourses(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<CourseResponse> courses = enrollmentService.getEnrolledCourses(currentUser);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }
}