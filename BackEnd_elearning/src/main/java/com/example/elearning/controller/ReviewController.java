package com.example.elearning.controller;

import com.example.elearning.dto.request.ReviewRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.entity.Review;
import com.example.elearning.dto.response.ReviewResponse;
import com.example.elearning.repository.ReviewRepository;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "⭐ Review Management")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Operation(summary = "Gửi hoặc cập nhật đánh giá (yêu cầu đăng nhập và đã mua khóa học)")
    @PostMapping
    @SecurityRequirement(name = "bearerAuth") // Chỉ API này yêu cầu xác thực
    public ResponseEntity<ApiResponse<Review>> postReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Review review = reviewService.createOrUpdateReview(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(review, "Cảm ơn bạn đã để lại đánh giá!"));
    }

    /**
     * Lấy tất cả các đánh giá của một khóa học.
     * Đây là API công khai, bất kỳ ai cũng có thể xem.
     */
    @Operation(summary = "Lấy tất cả đánh giá của một khóa học (Public)")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByCourse(@PathVariable Long courseId) {
        // Gọi đến service thay vì repository
        List<ReviewResponse> reviews = reviewService.getReviewsForCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}