package com.example.elearning.controller;

import com.example.elearning.dto.request.LessonProgressRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.entity.LessonProgress;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.LessonProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@Tag(name = "📊 Lesson Progress", description = "APIs theo dõi tiến độ học tập")
@SecurityRequirement(name = "bearerAuth")
public class LessonProgressController {

    @Autowired
    private LessonProgressService lessonProgressService;

    @Operation(summary = "Đánh dấu một bài học là hoàn thành/chưa hoàn thành")
    @PostMapping("/lesson")
    public ResponseEntity<ApiResponse<LessonProgress>> updateLessonProgress(
            @Valid @RequestBody LessonProgressRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        LessonProgress updatedProgress = lessonProgressService.updateLessonProgress(request, currentUser);
        String message = Boolean.TRUE.equals(request.getCompleted())
                ? "Đã đánh dấu hoàn thành bài học"
                : "Đã bỏ đánh dấu hoàn thành";
        return ResponseEntity.ok(ApiResponse.success(updatedProgress, message));
    }
}