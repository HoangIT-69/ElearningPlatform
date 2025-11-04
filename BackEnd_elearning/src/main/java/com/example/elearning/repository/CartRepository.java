package com.example.elearning.repository;

import com.example.elearning.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Tìm tất cả các item trong giỏ hàng của một user
    List<Cart> findByUserId(Long userId);

    // Kiểm tra xem một khóa học đã có trong giỏ hàng của user chưa
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    // Xóa một item cụ thể khỏi giỏ hàng
    void deleteByUserIdAndCourseId(Long userId, Long courseId);

    // Xóa tất cả các item trong giỏ hàng của một user
    void deleteAllByUserId(Long userId);
}