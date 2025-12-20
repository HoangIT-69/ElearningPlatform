package com.example.elearning.service;

import com.example.elearning.dto.request.LessonCreateRequest;
import com.example.elearning.dto.request.LessonUpdateRequest;
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

@Service
public class LessonService {

    @Autowired private LessonRepository lessonRepository;
    @Autowired private ChapterRepository chapterRepository;
    @Autowired private CourseRepository courseRepository;

    @Transactional
    public Lesson createLesson(LessonCreateRequest request, UserPrincipal currentUser) {
        Chapter chapter = findChapterOrThrow(request.getChapterId());
        Course course = chapter.getCourse(); // Lấy Course từ Chapter

        validateOwnership(course, currentUser);

        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setVideoDuration(request.getVideoDuration());
        lesson.setIsFree(request.getIsFree());
        lesson.setChapter(chapter); // Gán đối tượng Chapter

        // Tính toán thứ tự
        int lastOrderIndex = chapter.getLessons().stream()
                .mapToInt(Lesson::getOrderIndex).max().orElse(-1);
        lesson.setOrderIndex(lastOrderIndex + 1);

        // createdAt và updatedAt được quản lý tự động bởi @CreationTimestamp/@UpdateTimestamp

        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, LessonUpdateRequest request, UserPrincipal currentUser) {
        Lesson lesson = findLessonOrThrow(lessonId);
        Chapter chapter = lesson.getChapter(); // Lấy Chapter từ Lesson
        Course course = chapter.getCourse(); // Lấy Course từ Chapter

        validateOwnership(course, currentUser);

        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setVideoDuration(request.getVideoDuration());
        lesson.setIsFree(request.getIsFree());

        // updatedAt sẽ được cập nhật tự động bởi @UpdateTimestamp

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId, UserPrincipal currentUser) {
        Lesson lesson = findLessonOrThrow(lessonId);
        Chapter chapter = lesson.getChapter(); // Lấy Chapter từ Lesson
        Course course = chapter.getCourse(); // Lấy Course từ Chapter

        validateOwnership(course, currentUser);

        // Với orphanRemoval=true trong Chapter, chỉ cần gỡ Lesson khỏi danh sách của cha
        chapter.getLessons().remove(lesson);

        // Không cần gọi lessonRepository.delete(lesson) nữa,
        // nhưng gọi thêm cũng không sao và rõ ràng hơn.
        // lessonRepository.delete(lesson);
    }

    // === HELPER METHODS ===

    private Chapter findChapterOrThrow(Long chapterId) {
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException("Không tìm thấy chương học", HttpStatus.NOT_FOUND));
    }

    private Lesson findLessonOrThrow(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException("Không tìm thấy bài học", HttpStatus.NOT_FOUND));
    }

    private void validateOwnership(Course course, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));

        if (isAdmin) return;

        if (!course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN);
        }
    }
}