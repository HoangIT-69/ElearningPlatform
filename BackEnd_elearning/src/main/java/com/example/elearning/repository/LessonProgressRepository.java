package com.example.elearning.repository;

import com.example.elearning.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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

    /**
     * Lấy danh sách các ngày (duy nhất) mà người dùng có hoạt động học tập,
     * sắp xếp từ mới nhất đến cũ nhất.
     * @param enrollmentIds Danh sách các ID enrollment của người dùng.
     * @return Danh sách các ngày (LocalDate).
     */
    @Query("SELECT DISTINCT CAST(lp.updatedAt AS LocalDate) " +
            "FROM LessonProgress lp " +
            "WHERE lp.enrollmentId IN :enrollmentIds " +
            "ORDER BY CAST(lp.updatedAt AS LocalDate) DESC")
    List<LocalDate> findDistinctUpdatedDatesByEnrollmentIds(@Param("enrollmentIds") List<Long> enrollmentIds);
}