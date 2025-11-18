package com.example.elearning.service;

import com.example.elearning.dto.request.LessonProgressRequest;
import com.example.elearning.entity.Enrollment;
import com.example.elearning.entity.LessonProgress;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.LessonProgressRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LessonProgressService {

    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;

    /**
     * Cập nhật tiến độ của một bài học (ví dụ: đánh dấu là đã hoàn thành).
     * @return LessonProgress đã được cập nhật.
     */
    @Transactional
    public LessonProgress updateLessonProgress(LessonProgressRequest request, UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        // 1. Tìm bản ghi enrollment tương ứng
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(userId, request.getCourseId())
                .orElseThrow(() -> new AppException("Bạn chưa đăng ký khóa học này", HttpStatus.FORBIDDEN));

        // 2. Tìm hoặc tạo mới một bản ghi LessonProgress
        LessonProgress lessonProgress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollment.getId(), request.getLessonId())
                .orElse(new LessonProgress());

        // Gán các ID nếu là bản ghi mới
        if (lessonProgress.getId() == null) {
            lessonProgress.setEnrollmentId(enrollment.getId());
            lessonProgress.setLessonId(request.getLessonId());
        }

        // 3. Cập nhật trạng thái
        if (request.getCompleted() != null && request.getCompleted() && !lessonProgress.getCompleted()) {
            lessonProgress.setCompleted(true);
            lessonProgress.setCompletedAt(LocalDateTime.now());
        } else if (request.getCompleted() != null && !request.getCompleted() && lessonProgress.getCompleted()) {
            // Logic cho trường hợp bỏ hoàn thành
            lessonProgress.setCompleted(false);
            lessonProgress.setCompletedAt(null);
        }

        // TODO: Cập nhật lại `progress` trong bảng `enrollments`
        // 1. Lấy tất cả các bài học của khóa học
        // 2. Đếm số bài đã hoàn thành (completed = true) trong lesson_progress
        // 3. Tính toán % và cập nhật enrollment.setProgress(...)

        return lessonProgressRepository.save(lessonProgress);
    }
}