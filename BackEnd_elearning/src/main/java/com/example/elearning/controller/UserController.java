package com.example.elearning.controller;

import com.example.elearning.dto.request.AdminUserUpdateRequest;
import com.example.elearning.dto.request.UserChangePasswordRequest;
import com.example.elearning.dto.request.UserUpdateProfileRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.UserResponse;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "👤 User Management", description = "APIs quản lý người dùng")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Lấy danh sách tất cả người dùng (Yêu cầu quyền ADMIN)")
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @Operation(summary = "Lấy thông tin profile của người dùng đã đăng nhập")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse userProfile = userService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(userProfile));
    }

    @Operation(summary = "Người dùng tự cập nhật thông tin cá nhân")
    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserUpdateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse updatedUser = userService.updateUserProfile(userId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Cập nhật thông tin thành công"));
    }

    @Operation(summary = "Admin cập nhật thông tin của một người dùng bất kỳ (Yêu cầu quyền ADMIN)")
    @PutMapping("/admin/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserByAdmin(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserUpdateRequest request) {
        UserResponse updatedUser = userService.updateUserByAdmin(userId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Cập nhật thông tin người dùng thành công"));
    }

    @Operation(summary = "Người dùng tự thay đổi mật khẩu")
    @PostMapping("/profile/{userId}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody UserChangePasswordRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        userService.changePassword(userId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công"));
    }

    @Operation(summary = "Lấy thông tin của một người dùng bất kỳ theo ID (Yêu cầu quyền ADMIN)")
    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')") // Chỉ cho phép người có quyền ADMIN
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        UserResponse userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(userProfile));
    }

}