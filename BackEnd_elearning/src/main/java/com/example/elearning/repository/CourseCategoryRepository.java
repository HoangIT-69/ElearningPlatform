package com.example.elearning.repository;

import com.example.elearning.entity.CourseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseCategoryRepository extends JpaRepository<CourseCategory, Long> {

    /**
     * Tìm tất cả các danh mục được gán cho một khóa học.
     */
    List<CourseCategory> findByCourseId(Long courseId);

    /**
     * Tìm tất cả các khóa học thuộc về một danh mục.
     */
    List<CourseCategory> findByCategoryId(Long categoryId);

    /**
     * Kiểm tra xem một mối liên kết cụ thể đã tồn tại hay chưa.
     */
    Optional<CourseCategory> findByCourseIdAndCategoryId(Long courseId, Long categoryId);

    /**
     * Xóa một mối liên kết bằng courseId và categoryId.
     * Cần @Transactional khi định nghĩa phương thức xóa tùy chỉnh.
     */
    @Transactional
    void deleteByCourseIdAndCategoryId(Long courseId, Long categoryId);
}