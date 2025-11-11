package com.example.elearning.repository;

import com.example.elearning.entity.Course;
import com.example.elearning.enums.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    /**
     * Tìm một khóa học bằng slug (chuỗi định danh duy nhất trên URL).
     * @param slug Slug của khóa học.
     * @return Optional chứa Course nếu tìm thấy.
     */
    Optional<Course> findBySlug(String slug);

    /**
     * Tìm tất cả các khóa học được tạo bởi một giảng viên cụ thể.
     * @param instructorId ID của giảng viên.
     * @return Danh sách các khóa học.
     */
    List<Course> findByInstructorId(Long instructorId);

    /**
     * Tìm các khóa học theo trạng thái với phân trang.
     * @param status Trạng thái của khóa học (DRAFT, PUBLISHED...).
     * @param pageable Thông tin phân trang.
     * @return Một trang (Page) các khóa học.
     */
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    /**
     * Tìm các khóa học theo trạng thái và có miễn phí hay không, với phân trang.
     * @param status Trạng thái khóa học.
     * @param isFree True nếu là khóa học miễn phí.
     * @param pageable Thông tin phân trang.
     * @return Một trang các khóa học.
     */
    Page<Course> findByStatusAndIsFree(CourseStatus status, Boolean isFree, Pageable pageable);

    /**
     * Tìm kiếm khóa học theo tiêu đề hoặc mô tả ngắn (không phân biệt chữ hoa/thường).
     * @param search Từ khóa tìm kiếm.
     * @param status Chỉ tìm trong các khóa học có trạng thái này.
     * @param pageable Thông tin phân trang.
     * @return Một trang các khóa học phù hợp.
     */
    @Query("SELECT c FROM Course c WHERE " +
            "(LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.shortDescription) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND c.status = :status")
    Page<Course> searchCourses(@Param("search") String search,
                               @Param("status") CourseStatus status,
                               Pageable pageable);

    /**
     * Tìm các khóa học được đánh giá cao nhất.
     * Sắp xếp theo điểm đánh giá trung bình, sau đó là số lượng đăng ký.
     * @param status Chỉ tìm trong các khóa học có trạng thái này.
     * @param pageable Giới hạn số lượng kết quả (ví dụ: PageRequest.of(0, 10) để lấy top 10).
     * @return Danh sách khóa học được đánh giá cao.
     */
//    @Query("SELECT c FROM Course c WHERE c.status = :status " +
//            "ORDER BY c.averageRating DESC, c.enrollmentCount DESC")
//    List<Course> findTopRatedCourses(@Param("status") CourseStatus status, Pageable pageable);

    /**
     * Tìm các khóa học phổ biến nhất dựa trên số lượng đăng ký thực tế từ bảng Enrollments.
     * @param status Chỉ tìm trong các khóa học có trạng thái này (ví dụ: PUBLISHED).
     * @param pageable Giới hạn số lượng kết quả (ví dụ: PageRequest.of(0, 8) để lấy 8 khóa học đầu).
     * @return Danh sách các khóa học phổ biến.
     */
    @Query("SELECT c " +
            "FROM Course c " +
            "JOIN Enrollment e ON c.id = e.courseId " + // Kết nối với bảng Enrollment
            "WHERE c.status = :status " +
            "GROUP BY c.id " + // Nhóm theo từng khóa học
            "ORDER BY COUNT(e.id) DESC") // Sắp xếp theo số lượng enrollment giảm dần
    List<Course> findPopularCoursesByEnrollments(@Param("status") CourseStatus status, Pageable pageable);

    List<Course> findAllByIdIn(List<Long> ids);
}