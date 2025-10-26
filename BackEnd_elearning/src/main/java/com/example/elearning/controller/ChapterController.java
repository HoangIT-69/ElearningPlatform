package com.example.elearning.controller;

import com.example.elearning.dto.request.ChapterCreateRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.entity.Chapter;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.ChapterService;
import com.example.elearning.dto.request.ChapterUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chapters")
@Tag(name = "📖 Chapter Management")
@SecurityRequirement(name = "bearerAuth")
public class ChapterController {

    @Autowired
    private ChapterService chapterService;

    @PostMapping
    public ResponseEntity<ApiResponse<Chapter>> createChapter(@Valid @RequestBody ChapterCreateRequest request, @AuthenticationPrincipal UserPrincipal currentUser) {
        Chapter newChapter = chapterService.createChapter(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(newChapter, "Tạo chương thành công"));
    }

    // THÊM API UPDATE
    @PutMapping("/{chapterId}")
    public ResponseEntity<ApiResponse<Chapter>> updateChapter(@PathVariable Long chapterId, @Valid @RequestBody ChapterUpdateRequest request, @AuthenticationPrincipal UserPrincipal currentUser) {
        Chapter updatedChapter = chapterService.updateChapter(chapterId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(updatedChapter, "Cập nhật chương thành công"));
    }

    @DeleteMapping("/{chapterId}")
    public ResponseEntity<ApiResponse<Void>> deleteChapter(@PathVariable Long chapterId, @AuthenticationPrincipal UserPrincipal currentUser) {
        chapterService.deleteChapter(chapterId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa chương thành công"));
    }
}