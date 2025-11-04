package com.example.elearning.controller;

import com.example.elearning.dto.request.CartAddRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.CartResponse;
import com.example.elearning.entity.Cart;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "🛒 Cart Management", description = "APIs quản lý giỏ hàng")
@SecurityRequirement(name = "bearerAuth") // Tất cả các API trong đây đều yêu cầu đăng nhập
public class CartController {

    @Autowired
    private CartService cartService;

    @Operation(summary = "Xem giỏ hàng của tôi")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CartResponse>>> getMyCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<CartResponse> cart = cartService.getCartForUser(currentUser);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @Operation(summary = "Thêm một khóa học vào giỏ hàng")
    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> addToCart(@Valid @RequestBody CartAddRequest request, @AuthenticationPrincipal UserPrincipal currentUser) {
        Cart newCartItem = cartService.addToCart(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(newCartItem, "Đã thêm vào giỏ hàng"));
    }

    @Operation(summary = "Xóa một khóa học khỏi giỏ hàng")
    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(@PathVariable Long courseId, @AuthenticationPrincipal UserPrincipal currentUser) {
        cartService.removeFromCart(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa khỏi giỏ hàng"));
    }

    @Operation(summary = "Xóa tất cả các khóa học trong giỏ hàng")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        cartService.clearCart(currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Giỏ hàng đã được dọn dẹp"));
    }
}