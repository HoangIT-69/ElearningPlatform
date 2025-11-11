package com.example.elearning.controller;

import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.PurchaseHistoryResponse;
import com.example.elearning.entity.Order;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "📦 Order Management", description = "APIs quản lý đơn hàng")
@SecurityRequirement(name = "bearerAuth") // Yêu cầu đăng nhập cho tất cả các API trong đây
public class OrderController {

    @Autowired
    private OrderService orderService;


    @Operation(summary = "Lấy lịch sử mua hàng của người dùng hiện tại")
    @GetMapping("/my-history")
    public ResponseEntity<ApiResponse<List<PurchaseHistoryResponse>>> getMyPurchaseHistory(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<PurchaseHistoryResponse> history = orderService.getPurchaseHistory(currentUser);
        return ResponseEntity.ok(ApiResponse.success(history));
    }


}