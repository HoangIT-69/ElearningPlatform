package com.example.elearning.service;

import com.example.elearning.dto.request.ChapterCreateRequest;
import com.example.elearning.dto.request.ChapterUpdateRequest; //
import com.example.elearning.entity.Chapter;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.Lesson;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.ChapterRepository;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Transactional
    public Chapter createChapter(ChapterCreateRequest request, UserPrincipal currentUser) {
        Course course = findCourseOrThrow(request.getCourseId());

        // Kiểm tra quyền (Admin hoặc chủ sở hữu)
        validateOwnership(course, currentUser);

        Chapter chapter = new Chapter();
        chapter.setTitle(request.getTitle());
        chapter.setCourse(course);

        // Tự động tính toán thứ tự
        int lastOrderIndex = chapterRepository.findByCourseIdOrderByOrderIndexAsc(request.getCourseId())
                .stream().mapToInt(Chapter::getOrderIndex).max().orElse(-1);
        chapter.setOrderIndex(lastOrderIndex + 1);
        chapter.setCreatedAt(LocalDateTime.now());

        return chapterRepository.save(chapter);
    }

    @Transactional
    public Chapter updateChapter(Long chapterId, ChapterUpdateRequest request, UserPrincipal currentUser) {
        // 1. Tìm chương học cần cập nhật
        Chapter chapter = findChapterOrThrow(chapterId);

        // 2. Lấy đối tượng Course cha trực tiếp từ Chapter
        //    Không cần phải query lại CourseRepository
        Course course = chapter.getCourse(); // <-- THAY ĐỔI CHÍNH NẰM Ở ĐÂY

        // 3. Kiểm tra quyền sở hữu
        validateOwnership(course, currentUser);

        // 4. Cập nhật thông tin cho Chapter
        chapter.setTitle(request.getTitle());

        // Bạn có thể thêm các trường khác để cập nhật ở đây

        // 5. Lưu lại Chapter đã được cập nhật
        return chapterRepository.save(chapter);
    }



    @Transactional
    public void deleteChapter(Long chapterId, UserPrincipal currentUser) {
        Chapter chapter = findChapterOrThrow(chapterId);
        Course course = chapter.getCourse(); // <-- Sửa ở đây: Lấy course trực tiếp

        validateOwnership(course, currentUser);

        // --- LOGIC XÓA MỚI, ĐƠN GIẢN NHẤT ---
        // Chỉ cần gỡ bỏ Chapter khỏi danh sách của Course cha.
        // `orphanRemoval = true` sẽ tự động kích hoạt lệnh DELETE.
        course.getChapters().remove(chapter);
    }

    private Course findCourseOrThrow(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học với ID: " + courseId, HttpStatus.NOT_FOUND));
    }

    private Chapter findChapterOrThrow(Long chapterId) {
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException("Không tìm thấy chương học với ID: " + chapterId, HttpStatus.NOT_FOUND));
    }

    /**
     * Phương thức kiểm tra quyền trung tâm.
     * Cho phép nếu người dùng là Admin HOẶC là chủ sở hữu khóa học.
     */
    private void validateOwnership(Course course, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));

        // Nếu là Admin, cho phép thực hiện ngay lập tức
        if (isAdmin) {
            return;
        }

        // Nếu không phải Admin, kiểm tra xem có phải là instructor sở hữu khóa học không
        if (!course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền thực hiện hành động này trên khóa học", HttpStatus.FORBIDDEN);
        }
    }
}