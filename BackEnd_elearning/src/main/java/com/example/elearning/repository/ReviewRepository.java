package com.example.elearning.repository;

import com.example.elearning.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // Import Optional

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Tìm tất cả các đánh giá cho một khóa học cụ thể.
     */
    List<Review> findByCourseId(Long courseId);

    /**
     * Tính toán điểm đánh giá trung bình cho một khóa học.
     * Trả về Double vì AVG có thể là số thực.
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.courseId = :courseId")
    Double calculateAverageRating(@Param("courseId") Long courseId);

    // =================================================================
    // CÁC PHƯƠƠNG THỨC MỚI ĐƯỢC THÊM VÀO
    // =================================================================

    /**
     * Tìm một đánh giá duy nhất dựa trên cả userId và courseId.
     * Hữu ích để kiểm tra xem người dùng đã đánh giá khóa học này chưa.
     * @return Optional chứa Review nếu tìm thấy.
     */
    Optional<Review> findByUserIdAndCourseId(Long userId, Long courseId);

    /**
     * Đếm tổng số lượng đánh giá cho một khóa học.
     * @return Số lượng đánh giá (long).
     */
    long countByCourseId(Long courseId);
}