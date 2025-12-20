package com.example.elearning.service;

import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.dto.response.UserResponse;
import com.example.elearning.entity.Chapter;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.Enrollment;
import com.example.elearning.entity.User;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.*;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private MappingHelperService mappingHelper;

    @Transactional(readOnly = true)
    public List<CourseResponse> getEnrolledCourses(UserPrincipal currentUser) {
        Long studentId = currentUser.getId();

        // 1. Tìm tất cả các bản ghi enrollment của user
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        if (enrollments.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Lấy thông tin chi tiết các khóa học tương ứng
        List<Long> courseIds = enrollments.stream().map(Enrollment::getCourseId).collect(Collectors.toList());
        List<Course> enrolledCourses = courseRepository.findAllById(courseIds);

        // 3. Tối ưu hóa: Lấy thông tin giảng viên
        List<Long> instructorIds = enrolledCourses.stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        Map<Long, User> instructorMap = userRepository.findAllById(instructorIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // 4. Chuyển đổi Enrollment thành Map để tra cứu nhanh
        Map<Long, Enrollment> enrollmentMap = enrollments.stream()
                .collect(Collectors.toMap(Enrollment::getCourseId, Function.identity()));

        // 5. Chuyển đổi sang CourseResponse và tính toán tiến độ
        return enrolledCourses.stream().map(course -> {
            User instructor = instructorMap.get(course.getInstructorId());
            CourseResponse response = mappingHelper.mapToCourseResponse(course, instructor);

            // TÍNH TOÁN TIẾN ĐỘ MỘT CÁCH AN TOÀN
            Enrollment enrollment = enrollmentMap.get(course.getId());
            if (enrollment != null) {

                // a. Lấy tổng số bài học một cách an toàn
                long totalLessons = 0;
                // KIỂM TRA NULL Ở ĐÂY
                if (course.getChapters() != null && !course.getChapters().isEmpty()) {
                    List<Long> chapterIds = course.getChapters().stream()
                            .map(Chapter::getId)
                            .collect(Collectors.toList());
                    totalLessons = lessonRepository.countByChapterIdIn(chapterIds);
                }

                if (totalLessons > 0) {
                    // b. Đếm số bài đã hoàn thành
                    long completedLessons = lessonProgressRepository.countByEnrollmentIdAndCompleted(enrollment.getId(), true);

                    // c. Tính toán và gán %
                    int progress = (int) Math.round(((double) completedLessons / totalLessons) * 100);
                    response.setProgress(progress);
                }
            }

            return response;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getStudentsOfCourse(Long courseId, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
        if (!isAdmin && !course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền xem danh sách học viên của khóa học này", HttpStatus.FORBIDDEN);
        }

        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        if (enrollments.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> studentIds = enrollments.stream()
                .map(Enrollment::getStudentId)
                .distinct()
                .collect(Collectors.toList());

        List<User> students = userRepository.findAllById(studentIds);

        // --- BẮT ĐẦU SỬA LỖI ---
        // Gọi đến hàm mapToUserResponse trong mappingHelper
        return students.stream()
                .map(mappingHelper::mapToUserResponse)
                .collect(Collectors.toList());
        // --- KẾT THÚC SỬA LỖI ---
    }




}