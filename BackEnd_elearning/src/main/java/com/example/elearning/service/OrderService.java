package com.example.elearning.service;

import com.example.elearning.dto.response.PurchaseHistoryResponse;
import com.example.elearning.entity.Cart;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.Order;
import com.example.elearning.entity.OrderItem;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.CartRepository;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.OrderRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CourseRepository courseRepository;

    /**
     * Tạo một đơn hàng mới từ giỏ hàng của người dùng.
     * @param currentUser Người dùng đang thực hiện.
     * @return Order vừa được tạo.
     */
    @Transactional
    public Order createOrderFromCart(UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new AppException("Giỏ hàng của bạn đang trống", HttpStatus.BAD_REQUEST);
        }

        List<Long> courseIds = cartItems.stream().map(Cart::getCourseId).collect(Collectors.toList());
        List<Course> coursesInCart = courseRepository.findAllById(courseIds);

        BigDecimal totalAmount = coursesInCart.stream()
                .map(Course::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 1. Tạo đối tượng Order mới
        Order newOrder = new Order();
        newOrder.setUserId(userId);
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus("PENDING");

        // 2. Tạo danh sách OrderItem và THIẾT LẬP MỐI QUAN HỆ
        List<OrderItem> orderItems = coursesInCart.stream().map(course -> {
            OrderItem item = new OrderItem();
            item.setCourseId(course.getId());
            item.setPrice(course.getPrice());
            item.setOrder(newOrder);
            return item;
        }).collect(Collectors.toList());

        // 3. Gán danh sách item cho order
        newOrder.setOrderItems(orderItems);

        // 4. Lưu Order. Hibernate sẽ tự động lưu các OrderItem đi kèm.
        return orderRepository.save(newOrder);
    }
    @Transactional(readOnly = true)
    public List<PurchaseHistoryResponse> getPurchaseHistory(UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        // 1. Lấy tất cả các đơn hàng của user, sắp xếp theo ngày mới nhất
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (orders.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Tối ưu hóa: Lấy tất cả courseId từ tất cả các đơn hàng
        List<Long> allCourseIds = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .map(OrderItem::getCourseId)
                .distinct()
                .collect(Collectors.toList());

        // 3. Query một lần để lấy tất cả thông tin khóa học cần thiết
        Map<Long, Course> courseMap = courseRepository.findAllById(allCourseIds).stream()
                .collect(Collectors.toMap(Course::getId, Function.identity()));

        // 4. Xây dựng response
        return orders.stream().map(order -> {
            // Map thông tin chi tiết cho từng item trong đơn hàng
            List<PurchaseHistoryResponse.OrderItemDetail> itemDetails = order.getOrderItems().stream().map(item -> {
                Course course = courseMap.get(item.getCourseId());
                if (course == null) return null;
                return new PurchaseHistoryResponse.OrderItemDetail(
                        course.getId(),
                        course.getTitle(),
                        course.getSlug(),
                        course.getThumbnail(),
                        item.getPrice()
                );
            }).filter(Objects::nonNull).collect(Collectors.toList());

            // Tạo đối tượng PurchaseHistoryResponse cho mỗi đơn hàng
            return new PurchaseHistoryResponse(
                    order.getId(),
                    order.getCreatedAt(),
                    order.getTotalAmount(),
                    order.getStatus(),
                    itemDetails
            );
        }).collect(Collectors.toList());
    }
}