package com.example.elearning.service;

import com.example.elearning.dto.request.CourseCategoryRequest;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.CourseCategory;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.CategoryRepository;
import com.example.elearning.repository.CourseCategoryRepository;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseCategoryService {

    @Autowired
    private CourseCategoryRepository courseCategoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Gán một danh mục cho một khóa học.
     * Yêu cầu người thực hiện phải là Admin hoặc chủ sở hữu khóa học.
     */
    @Transactional
    public CourseCategory addCategoryToCourse(CourseCategoryRequest request, UserPrincipal currentUser) {
        // 1. Kiểm tra xem Course và Category có thực sự tồn tại không
        Course course = findCourseOrThrow(request.getCourseId());
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException("Không tìm thấy danh mục với ID: " + request.getCategoryId(), HttpStatus.NOT_FOUND));

        // 2. Kiểm tra quyền
        validateOwnership(course, currentUser);

        // 3. Kiểm tra xem mối liên kết đã tồn tại chưa để tránh lỗi UNIQUE constraint
        courseCategoryRepository.findByCourseIdAndCategoryId(request.getCourseId(), request.getCategoryId())
                .ifPresent(existingLink -> {
                    throw new AppException("Danh mục này đã được gán cho khóa học.", HttpStatus.BAD_REQUEST);
                });

        // 4. Tạo và lưu mối liên kết mới
        CourseCategory courseCategory = new CourseCategory();
        courseCategory.setCourseId(request.getCourseId());
        courseCategory.setCategoryId(request.getCategoryId());

        return courseCategoryRepository.save(courseCategory);
    }

    /**
     * Gỡ một danh mục khỏi một khóa học.
     * Yêu cầu người thực hiện phải là Admin hoặc chủ sở hữu khóa học.
     */
    @Transactional
    public void removeCategoryFromCourse(CourseCategoryRequest request, UserPrincipal currentUser) {
        // 1. Kiểm tra xem khóa học có tồn tại không để kiểm tra quyền
        Course course = findCourseOrThrow(request.getCourseId());

        // 2. Kiểm tra quyền
        validateOwnership(course, currentUser);

        // 3. Thực hiện xóa
        // Không cần kiểm tra sự tồn tại của liên kết, vì nếu không có thì câu lệnh delete cũng không làm gì cả.
        courseCategoryRepository.deleteByCourseIdAndCategoryId(request.getCourseId(), request.getCategoryId());
    }

    // --- Helper Methods ---

    private Course findCourseOrThrow(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học với ID: " + courseId, HttpStatus.NOT_FOUND));
    }

    private void validateOwnership(Course course, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));

        if (isAdmin) {
            return; // Admin có toàn quyền
        }

        // Nếu không phải Admin, kiểm tra xem có phải là instructor sở hữu khóa học không
        if (!course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền sửa đổi danh mục của khóa học này", HttpStatus.FORBIDDEN);
        }
    }
}