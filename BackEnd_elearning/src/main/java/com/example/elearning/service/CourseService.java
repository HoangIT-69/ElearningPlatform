package com.example.elearning.service;

import com.example.elearning.dto.request.CourseCreateRequest;
import com.example.elearning.dto.request.CourseUpdateRequest;
import com.example.elearning.dto.response.CourseDetailResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.entity.Chapter;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.User;
import com.example.elearning.entity.Category;
import com.example.elearning.entity.CourseCategory;
import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import com.example.elearning.exception.AppException; // Bạn cần tạo class Exception này
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.CourseSpecification;
import com.example.elearning.repository.CourseCategoryRepository;
import com.example.elearning.repository.CategoryRepository;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
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
    private final CourseSpecification courseSpecification;
    private final CourseCategoryRepository courseCategoryRepository;
    private final CategoryRepository categoryRepository;

    // 2. Cập nhật constructor để nhận tất cả dependency
    @Autowired
    public CourseService(CourseRepository courseRepository,
                         UserRepository userRepository,
                         CourseSpecification courseSpecification,
                         CourseCategoryRepository courseCategoryRepository,
                         CategoryRepository categoryRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseSpecification = courseSpecification;
        this.courseCategoryRepository = courseCategoryRepository;
        this.categoryRepository = categoryRepository;
    }

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
        List<Course> courses = courseRepository.findPopularCourses(CourseStatus.PUBLISHED, pageable);
        return mapListWithInstructors(courses);
    }

    @Transactional(readOnly = true)
    public Page<CourseResponse> getFreeCourses(int page, int size) {
        return getAllCourses(page, size, null, null, true, null);
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseById(Long id) {
        Course course = findCourseOrThrow(id);
        return mapToCourseDetailResponse(course);
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học với slug: " + slug, HttpStatus.NOT_FOUND));
        return mapToCourseDetailResponse(course);
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

    private CourseDetailResponse mapToCourseDetailResponse(Course course) {
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

        // --- 4. LẤY DANH SÁCH DANH MỤC (CATEGORIES) - PHẦN LOGIC MỚI ---
        // a. Tìm tất cả các mối liên kết (CourseCategory) cho khóa học này.
        List<CourseCategory> courseCategories = courseCategoryRepository.findByCourseId(course.getId());

        // b. Nếu có mối liên kết, trích xuất ra danh sách các ID của danh mục.
        if (courseCategories != null && !courseCategories.isEmpty()) {
            List<Long> categoryIds = courseCategories.stream()
                    .map(CourseCategory::getCategoryId)
                    .collect(Collectors.toList());

            // c. Thực hiện MỘT câu query duy nhất để lấy tất cả các đối tượng Category.
            List<Category> categories = categoryRepository.findAllById(categoryIds);
            response.setCategories(categories);
        } else {
            // Nếu không có danh mục nào, trả về một danh sách rỗng
            response.setCategories(Collections.emptyList());
        }
        // --- KẾT THÚC PHẦN LOGIC MỚI ---

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