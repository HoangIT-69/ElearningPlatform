package com.example.elearning.controller;

import com.example.elearning.dto.request.CourseCategoryRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.entity.CourseCategory;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.CourseCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course-categories")
@Tag(name = "🔗 Course-Category Link", description = "APIs gán/gỡ danh mục cho khóa học")
@SecurityRequirement(name = "bearerAuth")
public class CourseCategoryController {

    @Autowired
    private CourseCategoryService courseCategoryService;

    @Operation(summary = "Gán một danh mục cho khóa học (Admin hoặc chủ sở hữu)")
    @PostMapping
    public ResponseEntity<ApiResponse<CourseCategory>> addCategoryToCourse(
            @Valid @RequestBody CourseCategoryRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CourseCategory newLink = courseCategoryService.addCategoryToCourse(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(newLink, "Gán danh mục thành công"));
    }

    @Operation(summary = "Gỡ một danh mục khỏi khóa học (Admin hoặc chủ sở hữu)")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> removeCategoryFromCourse(
            @Valid @RequestBody CourseCategoryRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        courseCategoryService.removeCategoryFromCourse(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Gỡ danh mục thành công"));
    }
}