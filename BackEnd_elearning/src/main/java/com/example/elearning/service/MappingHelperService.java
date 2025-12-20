package com.example.elearning.service;

import com.example.elearning.dto.response.CourseDetailResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.dto.response.UserResponse;
import com.example.elearning.entity.*;
import com.example.elearning.repository.*;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MappingHelperService {

    @Autowired private UserRepository userRepository;
    @Autowired private CourseCategoryRepository courseCategoryRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;

    /**
     * Map từ Course Entity sang CourseResponse DTO cơ bản.
     */
    public CourseResponse mapToCourseResponse(Course course, User instructor) {
        CourseResponse response = new CourseResponse();
        BeanUtils.copyProperties(course, response); // Dùng BeanUtils cho gọn

        if (instructor != null) {
            response.setInstructorName(instructor.getFullName());
        } else {
            // Cố gắng tìm lại instructor nếu bị null (dự phòng)
            userRepository.findById(course.getInstructorId())
                    .ifPresent(user -> response.setInstructorName(user.getFullName()));
        }
        return response;
    }

    /**
     * Map từ User Entity sang UserResponse DTO.
     */
    public UserResponse mapToUserResponse(User user) {
        if (user == null) return null;
        UserResponse response = new UserResponse();
        BeanUtils.copyProperties(user, response, "password");
        return response;
    }

    /**
     * Map từ Course Entity sang CourseDetailResponse DTO đầy đủ.
     */
    public CourseDetailResponse mapToCourseDetailResponse(Course course, UserPrincipal currentUser) {
        CourseDetailResponse response = new CourseDetailResponse();
        BeanUtils.copyProperties(course, response);

        // Lấy thông tin giảng viên
        userRepository.findById(course.getInstructorId()).ifPresent(user -> {
            response.setInstructorName(user.getFullName());
            response.setInstructorAvatar(user.getAvatar());
            response.setInstructorBio(user.getBio());
        });

        // Tính toán tổng số bài học và thời lượng
        int totalLessons = 0;
        int totalDurationInSeconds = 0;
        if (course.getChapters() != null) {
            for (Chapter chapter : course.getChapters()) {
                if (chapter.getLessons() != null) {
                    totalLessons += chapter.getLessons().size();
                    totalDurationInSeconds += chapter.getLessons().stream()
                            .mapToInt(lesson -> lesson.getVideoDuration() != null ? lesson.getVideoDuration() : 0)
                            .sum();
                }
            }
        }
        response.setTotalLessons(totalLessons);
        response.setTotalDuration(totalDurationInSeconds);

        // Lấy danh sách danh mục
        List<CourseCategory> courseCategories = courseCategoryRepository.findByCourseId(course.getId());
        if (!courseCategories.isEmpty()) {
            List<Long> categoryIds = courseCategories.stream().map(CourseCategory::getCategoryId).collect(Collectors.toList());
            response.setCategories(categoryRepository.findAllById(categoryIds));
        } else {
            response.setCategories(Collections.emptyList());
        }

        // Kiểm tra trạng thái đăng ký và tiến độ học
        if (currentUser != null) {
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(currentUser.getId(), course.getId());
            if (enrollmentOpt.isPresent()) {
                response.setEnrolled(true);
                List<LessonProgress> progressList = lessonProgressRepository.findByEnrollmentIdAndCompleted(enrollmentOpt.get().getId(), true);
                Set<Long> completedIds = progressList.stream().map(LessonProgress::getLessonId).collect(Collectors.toSet());
                response.setCompletedLessonIds(completedIds);
            }
        }

        return response;
    }
}