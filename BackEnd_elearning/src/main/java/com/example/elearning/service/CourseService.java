package com.example.elearning.service;

import com.example.elearning.dto.request.CourseCreateRequest;
import com.example.elearning.dto.request.CourseUpdateRequest;
import com.example.elearning.dto.response.CourseDetailResponse;
import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.User;
import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.CourseSpecification;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    // --- CÁC DEPENDENCY CHÍNH ---
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseSpecification courseSpecification;
    private final EnrollmentRepository enrollmentRepository;
    private final MappingHelperService mappingHelper;

    @Autowired
    public CourseService(CourseRepository courseRepository, UserRepository userRepository,
                         CourseSpecification courseSpecification, EnrollmentRepository enrollmentRepository,
                         MappingHelperService mappingHelper) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseSpecification = courseSpecification;
        this.enrollmentRepository = enrollmentRepository;
        this.mappingHelper = mappingHelper;
    }

    // =================================================================
    // PUBLIC READ METHODS (API công khai, chỉ đọc)
    // =================================================================

    @Transactional(readOnly = true)
    public Page<CourseResponse> getAllCourses(int page, int size, String search, CourseLevel level, Boolean isFree, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Specification<Course> spec = buildCourseSpecification(search, level, isFree, categoryId);
        Page<Course> coursesPage = courseRepository.findAll(spec, pageable);

        Map<Long, User> instructorMap = getInstructorMap(coursesPage.getContent());
        return coursesPage.map(course -> mappingHelper.mapToCourseResponse(course, instructorMap.get(course.getInstructorId())));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPopularCourses(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Course> courses = courseRepository.findPopularCoursesByEnrollments(CourseStatus.PUBLISHED, pageable);

        Map<Long, User> instructorMap = getInstructorMap(courses);
        return courses.stream()
                .map(course -> mappingHelper.mapToCourseResponse(course, instructorMap.get(course.getInstructorId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<CourseResponse> getFreeCourses(int page, int size) {
        return getAllCourses(page, size, null, null, true, null);
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseById(Long id) {
        Course course = findCourseOrThrow(id);
        return mappingHelper.mapToCourseDetailResponse(course, getCurrentUser());
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));
        return mappingHelper.mapToCourseDetailResponse(course, getCurrentUser());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByInstructor(Long instructorId) {
        List<Course> courses = courseRepository.findByInstructorIdOrderByCreatedAtDesc(instructorId);
        User instructor = userRepository.findById(instructorId).orElse(null);
        return courses.stream()
                .map(course -> mappingHelper.mapToCourseResponse(course, instructor))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getEnrolledCourseContent(String slug, UserPrincipal currentUser) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        boolean isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(currentUser.getId(), course.getId());
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"));
        boolean isInstructorOfCourse = course.getInstructorId().equals(currentUser.getId());

        if (!isEnrolled && !isAdmin && !isInstructorOfCourse) {
            throw new AppException("Bạn không có quyền truy cập vào nội dung khóa học này", HttpStatus.FORBIDDEN);
        }

        return mappingHelper.mapToCourseDetailResponse(course, currentUser);
    }

    // =================================================================
    // PROTECTED WRITE METHODS (API cần xác thực, ghi dữ liệu)
    // =================================================================

    @Transactional
    public void incrementEnrollmentCount(Long courseId) {
        courseRepository.findById(courseId).ifPresent(course -> {
            course.setEnrollmentCount(course.getEnrollmentCount() + 1);
            courseRepository.save(course);
        });
    }

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

        User instructor = userRepository.findById(instructorId).orElse(null);
        return mappingHelper.mapToCourseResponse(savedCourse, instructor);
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
        User instructor = userRepository.findById(updatedCourse.getInstructorId()).orElse(null);
        return mappingHelper.mapToCourseResponse(updatedCourse, instructor);
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
        User instructor = userRepository.findById(updatedCourse.getInstructorId()).orElse(null);
        return mappingHelper.mapToCourseResponse(updatedCourse, instructor);
    }

    @Transactional
    public CourseResponse unpublishCourse(Long courseId, UserPrincipal currentUser) {
        Course course = findCourseOrThrow(courseId);
        validateOwnership(course, currentUser);
        course.setStatus(CourseStatus.DRAFT); //
        Course updatedCourse = courseRepository.save(course);
        User instructor = userRepository.findById(updatedCourse.getInstructorId()).orElse(null);
        return mappingHelper.mapToCourseResponse(updatedCourse, instructor);
    }

    // =================================================================
    // HELPER METHODS (Các phương thức hỗ trợ)
    // =================================================================

    private UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return null;
        }
        return (UserPrincipal) authentication.getPrincipal();
    }

    private Specification<Course> buildCourseSpecification(String search, CourseLevel level, Boolean isFree, Long categoryId) {
        Specification<Course> spec = Specification.where(courseSpecification.hasStatusPublished());
        if (search != null && !search.trim().isEmpty()) spec = spec.and(courseSpecification.titleOrDescriptionContains(search));
        if (level != null) spec = spec.and(courseSpecification.hasLevel(level));
        if (isFree != null) spec = spec.and(courseSpecification.isFree(isFree));
        if (categoryId != null && categoryId > 0) spec = spec.and(courseSpecification.hasCategory(categoryId));
        return spec;
    }

    private Course findCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học với ID: " + id, HttpStatus.NOT_FOUND));
    }

    private void validateOwnership(Course course, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
        if (isAdmin) return;
        if (!course.getInstructorId().equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN);
        }
    }

    private Map<Long, User> getInstructorMap(List<Course> courses) {
        if (courses.isEmpty()) return Collections.emptyMap();
        List<Long> instructorIds = courses.stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        return userRepository.findAllById(instructorIds).stream().collect(Collectors.toMap(User::getId, Function.identity()));
    }

    private String generateSlug(String title) {
        if (title == null) return "";
        return title.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9\\-]", "").trim();
    }
}