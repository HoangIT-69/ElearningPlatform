package com.example.elearning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistoryResponse {
    private Long orderId;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemDetail> items;

    // DTO con để chứa thông tin chi tiết của mỗi khóa học đã mua
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDetail {
        private Long courseId;
        private String courseTitle;
        private String courseSlug;
        private String courseThumbnail;
        private BigDecimal price;
    }
}