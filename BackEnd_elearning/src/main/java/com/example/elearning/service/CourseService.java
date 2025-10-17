package com.example.elearning.service;

import com.example.elearning.dto.request.CourseCreateRequest;
import com.example.elearning.dto.request.CourseUpdateRequest;
import com.example.elearning.dto.response.CourseDetailResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.User;
import com.example.elearning.entity.Lesson;
import com.example.elearning.entity.Chapter;
import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import com.example.elearning.exception.BadRequestException;
import com.example.elearning.exception.ResourceNotFoundException;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.CourseSpecification; // <-- IMPORT
import com.example.elearning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification; // <-- IMPORT
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseSpecification courseSpecification; // <-- THÊM VÀO: Khai báo Specification

    @Autowired
    // <-- SỬA LẠI CONSTRUCTOR: Inject thêm CourseSpecification
    public CourseService(CourseRepository courseRepository, UserRepository userRepository, CourseSpecification courseSpecification) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseSpecification = courseSpecification;
    }

    /**
     * Lấy tất cả khóa học với tìm kiếm và lọc động.
     */
    @Transactional(readOnly = true)
    public Page<CourseResponse> getAllCourses(int page, int size, String search, CourseLevel level, Boolean isFree) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Bắt đầu xây dựng Specification bằng cách kết hợp các điều kiện
        Specification<Course> spec = Specification.where(courseSpecification.hasStatusPublished());

        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and(courseSpecification.titleOrDescriptionContains(search));
        }
        if (level != null) {
            spec = spec.and(courseSpecification.hasLevel(level));
        }
        if (isFree != null) {
            spec = spec.and(courseSpecification.isFree(isFree));
        }

        // Thực thi query với Specification đã được xây dựng
        Page<Course> coursesPage = courseRepository.findAll(spec, pageable);

        // Tối ưu hóa N+1 query để lấy tên giảng viên
        return mapPageToCourseResponse(coursesPage);
    }

    /**
     * Lấy các khóa học phổ biến (trang chủ).
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getPopularCourses(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Course> courses = courseRepository.findPopularCourses(CourseStatus.PUBLISHED, pageable);

        // Tối ưu hóa N+1 query cho danh sách
        return mapListToCourseResponse(courses);
    }

    /**
     * Lấy các khóa học miễn phí (đã được thay thế bằng getAllCourses nhưng vẫn giữ lại để tương thích API cũ).
     */
    @Transactional(readOnly = true)
    public Page<CourseResponse> getFreeCourses(int page, int size) {
        // Gọi lại hàm chính với bộ lọc isFree = true
        return getAllCourses(page, size, null, null, true);
    }

    /**
     * Lấy chi tiết khóa học bằng ID.
     */
    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học với ID: " + id));
        return mapToCourseDetailResponse(course);
    }

    /**
     * Lấy chi tiết khóa học bằng Slug.
     */
    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học với slug: " + slug));
        return mapToCourseDetailResponse(course);
    }

    // --- CÁC PHƯƠNG THỨC GHI DỮ LIỆU (CREATE, UPDATE, DELETE) ---

    @Transactional
    public CourseResponse createCourse(CourseCreateRequest request, Long instructorId) {
        userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giảng viên với ID: " + instructorId));

        String slug = generateSlug(request.getTitle());
        if (courseRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setSlug(slug);
        course.setShortDescription(request.getShortDescription());
        course.setDescription(request.getDescription());
        course.setThumbnail(request.getThumbnail());
        course.setPreviewVideo(request.getPreviewVideo());
        course.setLevel(request.getLevel());
        course.setStatus(CourseStatus.DRAFT);
        course.setInstructorId(instructorId);

        if (Boolean.TRUE.equals(request.getIsFree())) {
            course.setIsFree(true);
            course.setPrice(BigDecimal.ZERO);
        } else {
            course.setIsFree(false);
            course.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        }
        course.setRequirements(request.getRequirements());
        course.setObjectives(request.getObjectives());

        Course savedCourse = courseRepository.save(course);
        return mapToCourseResponse(savedCourse);
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseUpdateRequest request, Long instructorId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học với ID: " + id));

        if (!course.getInstructorId().equals(instructorId)) {
            throw new BadRequestException("Bạn không có quyền cập nhật khóa học này");
        }

        if (request.getTitle() != null) {
            course.setTitle(request.getTitle());
            course.setSlug(generateSlug(request.getTitle()));
        }
        if (request.getShortDescription() != null) course.setShortDescription(request.getShortDescription());
        if (request.getDescription() != null) course.setDescription(request.getDescription());
        if (request.getThumbnail() != null) course.setThumbnail(request.getThumbnail());
        if (request.getPreviewVideo() != null) course.setPreviewVideo(request.getPreviewVideo());
        if (request.getLevel() != null) course.setLevel(request.getLevel());
        if (request.getPrice() != null) course.setPrice(request.getPrice());
        if (request.getIsFree() != null) {
            course.setIsFree(request.getIsFree());
            if (request.getIsFree()) course.setPrice(BigDecimal.ZERO);
        }
        if (request.getRequirements() != null) course.setRequirements(request.getRequirements());
        if (request.getObjectives() != null) course.setObjectives(request.getObjectives());

        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponse(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long id, Long instructorId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học với ID: " + id));

        if (!course.getInstructorId().equals(instructorId)) {
            throw new BadRequestException("Bạn không có quyền xóa khóa học này");
        }
        courseRepository.delete(course);
    }

    @Transactional
    public CourseResponse publishCourse(Long id, Long instructorId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học với ID: " + id));

        if (!course.getInstructorId().equals(instructorId)) {
            throw new BadRequestException("Bạn không có quyền publish khóa học này");
        }
        course.setStatus(CourseStatus.PUBLISHED);
        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponse(updatedCourse);
    }

    // --- CÁC PHƯƠNG THỨC HỖ TRỢ (HELPER METHODS) ---

    private String generateSlug(String title) {
        if (title == null) return "";
        return title.toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9\\-]", "")
                .replaceAll("-+", "-")
                .trim();
    }

    // Tối ưu hóa cho Page<Course>
    private Page<CourseResponse> mapPageToCourseResponse(Page<Course> coursesPage) {
        List<Long> instructorIds = coursesPage.getContent().stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        Map<Long, User> instructorMap = Collections.emptyMap();
        if (!instructorIds.isEmpty()) {
            instructorMap = userRepository.findAllById(instructorIds).stream().collect(Collectors.toMap(User::getId, Function.identity()));
        }
        Map<Long, User> finalInstructorMap = instructorMap;
        return coursesPage.map(course -> mapToCourseResponse(course, finalInstructorMap.get(course.getInstructorId())));
    }

    // Tối ưu hóa cho List<Course>
    private List<CourseResponse> mapListToCourseResponse(List<Course> courses) {
        List<Long> instructorIds = courses.stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        Map<Long, User> instructorMap = Collections.emptyMap();
        if (!instructorIds.isEmpty()) {
            instructorMap = userRepository.findAllById(instructorIds).stream().collect(Collectors.toMap(User::getId, Function.identity()));
        }
        Map<Long, User> finalInstructorMap = instructorMap;
        return courses.stream()
                .map(course -> mapToCourseResponse(course, finalInstructorMap.get(course.getInstructorId())))
                .collect(Collectors.toList());
    }

    private CourseResponse mapToCourseResponse(Course course, User instructor) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setSlug(course.getSlug());
        response.setShortDescription(course.getShortDescription());
        response.setThumbnail(course.getThumbnail());
        response.setLevel(course.getLevel());
        response.setStatus(course.getStatus());
        response.setPrice(course.getPrice());
        response.setIsFree(course.getIsFree());
        response.setTotalDuration(course.getTotalDuration());
        response.setEnrollmentCount(course.getEnrollmentCount());
        response.setAverageRating(course.getAverageRating());
        response.setReviewCount(course.getReviewCount());
        response.setInstructorId(course.getInstructorId());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());

        if (instructor != null) {
            response.setInstructorName(instructor.getFullName());
        } else {
            response.setInstructorName("N/A");
        }
        return response;
    }

    private CourseResponse mapToCourseResponse(Course course) {
        User instructor = userRepository.findById(course.getInstructorId()).orElse(null);
        return mapToCourseResponse(course, instructor);
    }


    private CourseDetailResponse mapToCourseDetailResponse(Course course) {
        CourseDetailResponse response = new CourseDetailResponse();
        // Copy các thuộc tính cơ bản từ course sang response
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setSlug(course.getSlug());
        response.setShortDescription(course.getShortDescription());
        response.setDescription(course.getDescription());
        response.setThumbnail(course.getThumbnail());
        response.setPreviewVideo(course.getPreviewVideo());
        response.setLevel(course.getLevel());
        response.setPrice(course.getPrice());
        response.setIsFree(course.getIsFree());
        response.setRequirements(course.getRequirements());
        response.setObjectives(course.getObjectives());
        response.setAverageRating(course.getAverageRating());
        response.setReviewCount(course.getReviewCount());
        response.setEnrollmentCount(course.getEnrollmentCount());

        // Lấy thông tin giảng viên
        userRepository.findById(course.getInstructorId()).ifPresent(user -> {
            response.setInstructorName(user.getFullName());
            response.setInstructorAvatar(user.getAvatar());
            response.setInstructorBio(user.getBio());
        });

        // Lấy chương trình học (chapters và lessons)
        // Nhờ có @OneToMany, chúng ta chỉ cần gọi course.getChapters()
        response.setChapters(course.getChapters());

        // Tính tổng thời lượng và tổng số bài học
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
        response.setTotalDuration(totalDurationInSeconds); // Gửi về dạng giây

        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());

        return response;
    }
}