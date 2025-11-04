package com.example.elearning.service;

import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.Enrollment;
import com.example.elearning.entity.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired private MappingHelperService mappingHelper; // <-- Đảm bảo đã inject

    @Transactional(readOnly = true)
    public List<CourseResponse> getEnrolledCourses(UserPrincipal currentUser) {
        Long studentId = currentUser.getId();

        // 1. Tìm tất cả các bản ghi enrollment của user
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        if (enrollments.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Trích xuất danh sách các courseId
        List<Long> courseIds = enrollments.stream()
                .map(Enrollment::getCourseId)
                .collect(Collectors.toList());

        // 3. Lấy thông tin chi tiết của tất cả các khóa học đó
        List<Course> enrolledCourses = courseRepository.findAllById(courseIds);

        // 4. Tối ưu hóa N+1 query để lấy tên giảng viên
        List<Long> instructorIds = enrolledCourses.stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        Map<Long, User> instructorMap = Collections.emptyMap();
        if (!instructorIds.isEmpty()) {
            instructorMap = userRepository.findAllById(instructorIds).stream()
                    .collect(Collectors.toMap(User::getId, Function.identity()));
        }

        // --- SỬA LẠI LOGIC MAPPING Ở ĐÂY ---
        // 5. Chuyển đổi sang CourseResponse bằng cách sử dụng lại helper service
        Map<Long, User> finalInstructorMap = instructorMap;
        return enrolledCourses.stream()
                .map(course -> mappingHelper.mapToCourseResponse(course, finalInstructorMap.get(course.getInstructorId())))
                .collect(Collectors.toList());
    }
}