package com.example.elearning.service;

import com.example.elearning.dto.response.ReviewResponse;
import com.example.elearning.entity.User;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.dto.request.ReviewRequest;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.Review;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.ReviewRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public Review createOrUpdateReview(ReviewRequest request, UserPrincipal currentUser) {
        Long userId = currentUser.getId();
        Long courseId = request.getCourseId();

        // 1. Kiểm tra xem người dùng đã mua khóa học này chưa
        if (!enrollmentRepository.existsByStudentIdAndCourseId(userId, courseId)) {
            throw new AppException("Bạn phải đăng ký khóa học trước khi để lại đánh giá.", HttpStatus.FORBIDDEN);
        }

        // 2. Tạo hoặc cập nhật đánh giá
        // unique constraint (user_id, course_id) sẽ đảm bảo mỗi người chỉ có 1 đánh giá
        Review review = reviewRepository.findByUserIdAndCourseId(userId, courseId).orElse(new Review());

        review.setUserId(userId);
        review.setCourseId(courseId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        // 3. CẬP NHẬT LẠI THÔNG TIN CỦA KHÓA HỌC
        updateCourseRating(courseId);

        return savedReview;
    }

    @Transactional
    public void updateCourseRating(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        // Tính toán lại rating trung bình từ DB
        Double avgRating = reviewRepository.calculateAverageRating(courseId);
        if (avgRating == null) {
            avgRating = 0.0;
        }
        // Làm tròn đến 1 chữ số thập phân
        BigDecimal newAverageRating = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);

        // Đếm lại tổng số review
        long reviewCount = reviewRepository.countByCourseId(courseId);

        course.setAverageRating(newAverageRating);
        course.setReviewCount((int) reviewCount);

        courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForCourse(Long courseId) {
        // 1. Lấy tất cả các review entity
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        if (reviews.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Tối ưu hóa N+1: Lấy danh sách userId và query một lần
        List<Long> userIds = reviews.stream().map(Review::getUserId).distinct().collect(Collectors.toList());
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // 3. Map từ Review Entity sang ReviewResponse DTO
        return reviews.stream().map(review -> {
            ReviewResponse res = new ReviewResponse();
            res.setId(review.getId());
            res.setRating(review.getRating());
            res.setComment(review.getComment());
            res.setCreatedAt(review.getCreatedAt());

            User author = userMap.get(review.getUserId());
            if (author != null) {
                res.setUserId(author.getId());
                res.setUserFullName(author.getFullName());
                res.setUserAvatar(author.getAvatar());
            }
            return res;
        }).collect(Collectors.toList());
    }
}