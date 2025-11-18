package com.example.elearning.service;

import com.example.elearning.dto.request.CourseCreateRequest;
import com.example.elearning.dto.request.CourseUpdateRequest;
import com.example.elearning.dto.response.CourseDetailResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.entity.*;
import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import com.example.elearning.exception.AppException; // Bạn cần tạo class Exception này
import com.example.elearning.repository.*;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseSpecification courseSpecification;
    private final CourseCategoryRepository courseCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final LessonProgressRepository  lessonProgressRepository;

    // 2. Cập nhật constructor để nhận tất cả dependency
    @Autowired
    public CourseService(CourseRepository courseRepository,
                         UserRepository userRepository,
                         CourseSpecification courseSpecification,
                         CourseCategoryRepository courseCategoryRepository,
                         CategoryRepository categoryRepository ,  LessonProgressRepository lessonProgressRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseSpecification = courseSpecification;
        this.courseCategoryRepository = courseCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.lessonProgressRepository= lessonProgressRepository;
    }

    @Autowired private EnrollmentRepository enrollmentRepository;



    // =================================================================
    // PUBLIC READ METHODS (API công khai, chỉ đọc)
    // =================================================================

    @Transactional(readOnly = true)
    public Page<CourseResponse> getAllCourses(int page, int size, String search, CourseLevel level, Boolean isFree, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Specification<Course> spec = buildCourseSpecification(search, level, isFree, categoryId);
        Page<Course> coursesPage = courseRepository.findAll(spec, pageable);
        return mapPageWithInstructors(coursesPage);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPopularCourses(int limit) {
        Pageable pageable = PageRequest.of(0, limit);


        List<Course> courses = courseRepository.findPopularCoursesByEnrollments(CourseStatus.PUBLISHED, pageable);


        return mapListWithInstructors(courses);
    }

    @Transactional(readOnly = true)
    public Page<CourseResponse> getFreeCourses(int page, int size) {
        return getAllCourses(page, size, null, null, true, null);
    }

    @Transactional
    public void incrementEnrollmentCount(Long courseId) {
        courseRepository.findById(courseId).ifPresent(course -> {
            course.setEnrollmentCount(course.getEnrollmentCount() + 1);
            courseRepository.save(course);
        });
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        // Tự động lấy người dùng hiện tại từ SecurityContext
        UserPrincipal currentUser = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            currentUser = (UserPrincipal) authentication.getPrincipal();
        }

        return mapToCourseDetailResponse(course, currentUser);
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        // Lấy thông tin người dùng hiện tại (nếu có)
        UserPrincipal currentUser = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            currentUser = (UserPrincipal) authentication.getPrincipal();
        }

        return mapToCourseDetailResponse(course, currentUser);
    }

    // =================================================================
    // PROTECTED WRITE METHODS (API cần xác thực, ghi dữ liệu)
    // =================================================================

    @Transactional
    public CourseResponse createCourse(CourseCreateRequest request, Long instructorId) {
        userRepository.findById(instructorId)
                .orElseThrow(() -> new AppException("Không tìm thấy giảng viên với ID: " + instructorId, HttpStatus.NOT_FOUND));

        String slug = generateSlug(request.getTitle());
        if (courseRepository.findBySlug(slug).isPresent()) {
            slug += "-" + System.currentTimeMillis();
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
    public CourseResponse updateCourse(Long courseId, CourseUpdateRequest request, UserPrincipal currentUser) {
        Course course = findCourseOrThrow(courseId);
        validateOwnership(course, currentUser);

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
    public void deleteCourse(Long courseId, UserPrincipal currentUser) {
        Course course = findCourseOrThrow(courseId);
        validateOwnership(course, currentUser);
        courseRepository.delete(course);
    }

    @Transactional
    public CourseResponse publishCourse(Long courseId, UserPrincipal currentUser) {
        Course course = findCourseOrThrow(courseId);
        validateOwnership(course, currentUser);
        course.setStatus(CourseStatus.PUBLISHED);
        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponse(updatedCourse);
    }

    // File: CourseService.java
// ...

    @Transactional(readOnly = true)
    public CourseDetailResponse getEnrolledCourseContent(String slug, UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        // 1. Lấy thông tin khóa học
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        // 2. **KIỂM TRA QUYỀN TRUY CẬP**
        boolean isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(userId, course.getId());

        // Kiểm tra thêm nếu là Admin hoặc Instructor của khóa học thì cũng cho vào
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"));
        boolean isInstructorOfCourse = course.getInstructorId().equals(userId);

        if (!isEnrolled && !isAdmin && !isInstructorOfCourse) {
            throw new AppException("Bạn không có quyền truy cập vào nội dung khóa học này", HttpStatus.FORBIDDEN);
        }

        // 3. Nếu có quyền, trả về thông tin chi tiết
        return mapToCourseDetailResponse(course, currentUser); // Tái sử dụng hàm map cũ
    }

    // =================================================================
    // HELPER & MAPPING METHODS (Các phương thức hỗ trợ)
    // =================================================================

    private Specification<Course> buildCourseSpecification(String search, CourseLevel level, Boolean isFree, Long categoryId) {
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
        if (categoryId != null && categoryId > 0) {
            spec = spec.and(courseSpecification.hasCategory(categoryId));
        }
        return spec;
    }

    private Course findCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học với ID: " + id, HttpStatus.NOT_FOUND));
    }

    private void validateOwnership(Course course, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
        if (isAdmin) {
            return; // Admin có toàn quyền, bỏ qua kiểm tra
        }
        if (!course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN);
        }
    }

    private Map<Long, User> getInstructorMap(List<Course> courses) {
        if (courses.isEmpty()) {
            return Collections.emptyMap();
        }
        List<Long> instructorIds = courses.stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        return userRepository.findAllById(instructorIds).stream().collect(Collectors.toMap(User::getId, Function.identity()));
    }

    private Page<CourseResponse> mapPageWithInstructors(Page<Course> coursesPage) {
        Map<Long, User> instructorMap = getInstructorMap(coursesPage.getContent());
        return coursesPage.map(course -> mapToCourseResponse(course, instructorMap.get(course.getInstructorId())));
    }

    private List<CourseResponse> mapListWithInstructors(List<Course> courses) {
        Map<Long, User> instructorMap = getInstructorMap(courses);
        return courses.stream().map(course -> mapToCourseResponse(course, instructorMap.get(course.getInstructorId()))).collect(Collectors.toList());
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

    private CourseDetailResponse mapToCourseDetailResponse(Course course, UserPrincipal currentUser) {
        CourseDetailResponse response = new CourseDetailResponse();

        // --- 1. Map các thuộc tính trực tiếp từ Course ---
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
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());

        // --- 2. Lấy thông tin giảng viên (Instructor) ---
        userRepository.findById(course.getInstructorId()).ifPresent(user -> {
            response.setInstructorName(user.getFullName());
            response.setInstructorAvatar(user.getAvatar());
            response.setInstructorBio(user.getBio());
        });

        // --- 3. Lấy và tính toán thông tin từ chương trình học (Chapters & Lessons) ---
        response.setChapters(course.getChapters());
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

        // --- 4. Lấy danh sách danh mục (Categories) ---
        List<CourseCategory> courseCategories = courseCategoryRepository.findByCourseId(course.getId());
        if (courseCategories != null && !courseCategories.isEmpty()) {
            List<Long> categoryIds = courseCategories.stream()
                    .map(CourseCategory::getCategoryId)
                    .collect(Collectors.toList());
            List<Category> categories = categoryRepository.findAllById(categoryIds);
            response.setCategories(categories);
        } else {
            response.setCategories(Collections.emptyList());
        }

        // --- 5. KIỂM TRA TRẠNG THÁI ĐĂNG KÝ VÀ TIẾN ĐỘ HỌC ---
        if (currentUser != null) {
            // a. Kiểm tra xem người dùng đã đăng ký khóa học này chưa
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(currentUser.getId(), course.getId());

            if (enrollmentOpt.isPresent()) {
                // Nếu đã đăng ký:
                response.setEnrolled(true);

                // b. Lấy danh sách các bài học đã hoàn thành
                Enrollment enrollment = enrollmentOpt.get();
                List<LessonProgress> progressList = lessonProgressRepository.findByEnrollmentIdAndCompleted(enrollment.getId(), true);
                Set<Long> completedIds = progressList.stream().map(LessonProgress::getLessonId).collect(Collectors.toSet());
                response.setCompletedLessonIds(completedIds);
            }
            // Nếu enrollmentOpt rỗng, isEnrolled và completedLessonIds sẽ giữ giá trị mặc định (false và set rỗng)
        }

        return response;
    }

    private String generateSlug(String title) {
        if (title == null) return "";
        return title.toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9\\-]", "")
                .replaceAll("-+", "-")
                .trim();
    }
}