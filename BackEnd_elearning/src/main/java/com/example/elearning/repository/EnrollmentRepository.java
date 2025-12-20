package com.example.elearning.repository;

import com.example.elearning.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Tìm tất cả các khóa học mà một sinh viên đã đăng ký.
     * @param studentId ID của sinh viên.
     * @return Danh sách các bản ghi Enrollment.
     */
    List<Enrollment> findByStudentId(Long studentId);

    /**
     * Kiểm tra xem một sinh viên đã đăng ký một khóa học cụ thể hay chưa.
     * Cực kỳ quan trọng cho logic của Giỏ hàng và Trang chi tiết khóa học.
     * @param studentId ID của sinh viên.
     * @param courseId ID của khóa học.
     * @return true nếu đã đăng ký, ngược lại là false.
     */
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    Optional<Enrollment> findByStudentIdAndCourseId(Long userId, Long courseId);


    List<Enrollment> findByCourseId(Long courseId);

}