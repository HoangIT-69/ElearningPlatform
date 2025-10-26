package com.example.elearning.controller;

import com.example.elearning.dto.request.CourseCreateRequest;
import com.example.elearning.dto.request.CourseUpdateRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.CourseDetailResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.enums.CourseLevel;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "📚 Course Management", description = "APIs quản lý khóa học")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @Operation(summary = "Lấy danh sách khóa học với tìm kiếm và lọc động",
            description = "Lấy danh sách khóa học với phân trang, tìm kiếm và các bộ lọc. API này public.")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getAllCourses(
            @Parameter(description = "Số trang (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng/trang") @RequestParam(defaultValue = "12") int size,
            @Parameter(description = "Tìm kiếm theo từ khóa") @RequestParam(required = false) String search,
            @Parameter(description = "Lọc theo cấp độ") @RequestParam(required = false) CourseLevel level,
            @Parameter(description = "Lọc khóa học miễn phí") @RequestParam(required = false) Boolean isFree,
            @Parameter(description = "Lọc theo ID danh mục") @RequestParam(required = false) Long categoryId
    ) {
        Page<CourseResponse> courses = courseService.getAllCourses(page, size, search, level, isFree, categoryId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @Operation(summary = "Lấy khóa học phổ biến", description = "API này public.")
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPopularCourses(
            @Parameter(description = "Số lượng khóa học") @RequestParam(defaultValue = "8") int limit
    ) {
        List<CourseResponse> courses = courseService.getPopularCourses(limit);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @Operation(summary = "Lấy khóa học miễn phí", description = "API này public.")
    @GetMapping("/free")
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getFreeCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<CourseResponse> courses = courseService.getFreeCourses(page, size);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @Operation(summary = "Lấy chi tiết khóa học theo ID", description = "API này public.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getCourseById(@PathVariable Long id) {
        CourseDetailResponse course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @Operation(summary = "Lấy khóa học theo slug", description = "API này public.")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getCourseBySlug(@PathVariable String slug) {
        CourseDetailResponse course = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @Operation(summary = "Tạo khóa học mới", description = "Chỉ INSTRUCTOR hoặc ADMIN.", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CourseCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        // Phương thức createCourse trong service chỉ cần ID, nên giữ nguyên
        CourseResponse course = courseService.createCourse(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(course, "Tạo khóa học thành công"));
    }

    @Operation(summary = "Cập nhật khóa học", description = "Chỉ INSTRUCTOR (chủ sở hữu) hoặc ADMIN.", security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        // SỬA LẠI: Truyền cả đối tượng currentUser vào service
        CourseResponse course = courseService.updateCourse(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(course, "Cập nhật khóa học thành công"));
    }

    @Operation(summary = "Xóa khóa học", description = "Chỉ INSTRUCTOR (chủ sở hữu) hoặc ADMIN.", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        // SỬA LẠI: Truyền cả đối tượng currentUser vào service
        courseService.deleteCourse(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa khóa học thành công"));
    }

    @Operation(summary = "Publish khóa học", description = "Chỉ INSTRUCTOR (chủ sở hữu) hoặc ADMIN.", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        // SỬA LẠI: Truyền cả đối tượng currentUser vào service
        CourseResponse course = courseService.publishCourse(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(course, "Publish khóa học thành công"));
    }
}