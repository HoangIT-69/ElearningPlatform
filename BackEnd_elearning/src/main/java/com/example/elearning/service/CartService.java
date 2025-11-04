package com.example.elearning.service;

import com.example.elearning.dto.request.CartAddRequest;
import com.example.elearning.dto.response.CartResponse;
import com.example.elearning.entity.Cart;
import com.example.elearning.entity.Course;
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
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private UserRepository userRepository;
  @Autowired private EnrollmentRepository enrollmentRepository; // Dùng để kiểm tra khóa học đã mua

    @Transactional(readOnly = true)
    public List<CartResponse> getCartForUser(UserPrincipal currentUser) {
        Long userId = currentUser.getId();
        // 1. Lấy tất cả các item trong giỏ hàng của user
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Tối ưu hóa N+1 query: Lấy tất cả courseId và instructorId
        List<Long> courseIds = cartItems.stream().map(Cart::getCourseId).collect(Collectors.toList());
        List<Course> courses = courseRepository.findAllById(courseIds);
        List<Long> instructorIds = courses.stream().map(Course::getInstructorId).distinct().collect(Collectors.toList());
        Map<Long, User> instructorMap = userRepository.findAllById(instructorIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<Long, Course> courseMap = courses.stream()
                .collect(Collectors.toMap(Course::getId, Function.identity()));

        // 3. Xây dựng response
        return cartItems.stream().map(cartItem -> {
            Course course = courseMap.get(cartItem.getCourseId());
            if (course == null) return null; // Bỏ qua nếu khóa học đã bị xóa
            User instructor = instructorMap.get(course.getInstructorId());

            CartResponse res = new CartResponse();
            res.setCourseId(course.getId());
            res.setCourseTitle(course.getTitle());
            res.setCourseSlug(course.getSlug());
            res.setCourseThumbnail(course.getThumbnail());
            res.setPrice(course.getPrice());
            res.setInstructorName(instructor != null ? instructor.getFullName() : "N/A");
            res.setAddedAt(cartItem.getAddedAt());
            return res;
        }).filter(res -> res != null).collect(Collectors.toList());
    }

    @Transactional
    public Cart addToCart(CartAddRequest request, UserPrincipal currentUser) {
        Long userId = currentUser.getId();
        Long courseId = request.getCourseId();

        // Kiểm tra xem khóa học có tồn tại không
        courseRepository.findById(courseId).orElseThrow(() ->
                new AppException("Không tìm thấy khóa học", HttpStatus.NOT_FOUND));

        // Kiểm tra xem người dùng đã mua khóa học này chưa
        if (enrollmentRepository.existsByStudentIdAndCourseId(userId, courseId)) {
            throw new AppException("Bạn đã sở hữu khóa học này", HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra xem khóa học đã có trong giỏ hàng chưa
        if (cartRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException("Khóa học đã có trong giỏ hàng", HttpStatus.BAD_REQUEST);
        }

        Cart newCartItem = new Cart(userId, courseId);
        return cartRepository.save(newCartItem);
    }

    @Transactional
    public void removeFromCart(Long courseId, UserPrincipal currentUser) {
        cartRepository.deleteByUserIdAndCourseId(currentUser.getId(), courseId);
    }

    @Transactional
    public void clearCart(UserPrincipal currentUser) {
        cartRepository.deleteAllByUserId(currentUser.getId());
    }
}