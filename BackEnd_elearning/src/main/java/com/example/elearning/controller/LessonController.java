package com.example.elearning.controller;

import com.example.elearning.dto.request.LessonCreateRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.entity.Lesson;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.LessonService;
import com.example.elearning.dto.request.LessonUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
@Tag(name = "▶️ Lesson Management")
@SecurityRequirement(name = "bearerAuth")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @PostMapping
    public ResponseEntity<ApiResponse<Lesson>> createLesson(@Valid @RequestBody LessonCreateRequest request, @AuthenticationPrincipal UserPrincipal currentUser) {
        Lesson newLesson = lessonService.createLesson(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(newLesson, "Tạo bài học thành công"));
    }

    // THÊM API UPDATE
    @PutMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<Lesson>> updateLesson(@PathVariable Long lessonId, @Valid @RequestBody LessonUpdateRequest request, @AuthenticationPrincipal UserPrincipal currentUser) {
        Lesson updatedLesson = lessonService.updateLesson(lessonId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(updatedLesson, "Cập nhật bài học thành công"));
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long lessonId, @AuthenticationPrincipal UserPrincipal currentUser) {
        lessonService.deleteLesson(lessonId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa bài học thành công"));
    }
}