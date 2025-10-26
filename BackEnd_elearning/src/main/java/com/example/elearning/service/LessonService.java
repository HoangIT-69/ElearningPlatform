package com.example.elearning.service;

import com.example.elearning.dto.request.LessonCreateRequest;
import com.example.elearning.dto.request.LessonUpdateRequest; // <-- TẠO FILE NÀY
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

    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Transactional
    public Lesson createLesson(LessonCreateRequest request, UserPrincipal currentUser) {
        Chapter chapter = findChapterOrThrow(request.getChapterId());
        Course course = findCourseOrThrow(chapter.getCourseId());

        // Kiểm tra quyền
        validateOwnership(course, currentUser);

        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setVideoDuration(request.getVideoDuration());
        lesson.setIsFree(request.getIsFree());
        lesson.setChapterId(request.getChapterId());

        int lastOrderIndex = lessonRepository.findByChapterIdOrderByOrderIndexAsc(request.getChapterId())
                .stream().mapToInt(Lesson::getOrderIndex).max().orElse(-1);
        lesson.setOrderIndex(lastOrderIndex + 1);

        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, LessonUpdateRequest request, UserPrincipal currentUser) {
        Lesson lesson = findLessonOrThrow(lessonId);
        Chapter chapter = findChapterOrThrow(lesson.getChapterId());
        Course course = findCourseOrThrow(chapter.getCourseId());

        // Kiểm tra quyền
        validateOwnership(course, currentUser);

        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setVideoDuration(request.getVideoDuration());
        lesson.setIsFree(request.getIsFree());
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId, UserPrincipal currentUser) {
        Lesson lesson = findLessonOrThrow(lessonId);
        Chapter chapter = findChapterOrThrow(lesson.getChapterId());
        Course course = findCourseOrThrow(chapter.getCourseId());

        // Kiểm tra quyền
        validateOwnership(course, currentUser);

        lessonRepository.delete(lesson);
    }

    // === HELPER METHODS ===

    private Course findCourseOrThrow(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));
    }

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

        if (isAdmin) {
            return;
        }

        if (!course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN);
        }
    }
}