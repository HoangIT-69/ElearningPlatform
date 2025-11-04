package com.example.elearning.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- BỎ THUỘC TÍNH NÀY ĐI ---
    // @Column(name = "order_id", nullable = false)
    // private Long orderId;
    // ----------------------------

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private BigDecimal price; // Giá tại thời điểm mua

    // --- THÊM MỐI QUAN HỆ NGƯỢC LẠI Ở ĐÂY ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false) // Đây là cột khóa ngoại trong DB
    @JsonIgnore // Ngăn việc lặp vô hạn khi API trả về JSON
    private Order order;
    // ------------------------------------

    // Constructor cũ không còn cần thiết, nhưng có thể giữ lại nếu muốn
    // public OrderItem(Long orderId, Long courseId, BigDecimal price) { ... }
}