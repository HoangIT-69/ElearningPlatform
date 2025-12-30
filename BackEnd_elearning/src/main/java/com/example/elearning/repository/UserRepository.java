package com.example.elearning.repository;


import com.example.elearning.dto.response.PopularInstructorResponse;
import com.example.elearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    /**
     * Tìm các giảng viên tiêu biểu, sắp xếp theo tổng số học viên.
     * Câu query này sẽ:
     * 1. JOIN từ User (u) sang Course (c).
     * 2. Chỉ lấy các User có vai trò là INSTRUCTOR.
     * 3. Chỉ tính các khóa học đã được PUBLISHED.
     * 4. GROUP BY theo từng giảng viên.
     * 5. SELECT ra các thông tin cần thiết và các giá trị tổng hợp (SUM, AVG, COUNT).
     * 6. ORDER BY theo tổng số học viên giảm dần.
     */
    @Query("SELECT new com.example.elearning.dto.response.PopularInstructorResponse(" +
            "u.id, u.fullName, u.avatar, u.bio, " +
            "SUM(c.enrollmentCount), " +
            "AVG(c.averageRating), " +
            "COUNT(c.id)) " +
            "FROM User u JOIN Course c ON u.id = c.instructorId " +
            "WHERE u.role = 'INSTRUCTOR' AND c.status = 'PUBLISHED' " +
            "GROUP BY u.id, u.fullName, u.avatar, u.bio " +
            "ORDER BY SUM(c.enrollmentCount) DESC")
    List<PopularInstructorResponse> findPopularInstructors(Pageable pageable);
}