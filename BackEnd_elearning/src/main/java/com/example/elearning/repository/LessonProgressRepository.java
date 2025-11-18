package com.example.elearning.repository;

import com.example.elearning.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    // Tìm một tiến độ cụ thể của user cho một bài học
    Optional<LessonProgress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);

    // Lấy tất cả tiến độ của một lượt đăng ký học (để tính toán % hoàn thành)
    List<LessonProgress> findByEnrollmentId(Long enrollmentId);

    List<LessonProgress> findByEnrollmentIdAndCompleted(Long enrollmentId, boolean status);

    long countByEnrollmentIdAndCompleted(Long enrollmentId, boolean completed);
}