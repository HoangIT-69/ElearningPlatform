package com.example.elearning.service;

import com.example.elearning.dto.request.AdminUserUpdateRequest;
import com.example.elearning.dto.request.UserChangePasswordRequest; // <-- Thêm import
import com.example.elearning.dto.request.UserUpdateProfileRequest;
import com.example.elearning.dto.response.PopularInstructorResponse;
import com.example.elearning.dto.response.UserResponse;
import com.example.elearning.entity.User;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.security.UserPrincipal;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Thêm import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Lấy danh sách tất cả người dùng (chỉ dành cho ADMIN).
     */
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToUserResponse);
    }

    // =================================================================
    // PHƯƠNG THỨC MỚI ĐƯỢC THÊM VÀO
    // =================================================================
    /**
     * Lấy thông tin hồ sơ của một người dùng theo ID.
     */
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = findUserOrThrow(userId);
        return mapToUserResponse(user);
    }
    // =================================================================

    /**
     * Người dùng tự cập nhật thông tin cá nhân.
     */
    @Transactional
    public UserResponse updateUserProfile(Long userId, UserUpdateProfileRequest request, UserPrincipal currentUser) {
        if (!userId.equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền cập nhật thông tin của người dùng này", HttpStatus.FORBIDDEN);
        }

        User user = findUserOrThrow(userId);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getBio() != null) user.setBio(request.getBio());

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    /**
     * Admin cập nhật thông tin của một người dùng bất kỳ.
     */
    @Transactional
    public UserResponse updateUserByAdmin(Long userId, AdminUserUpdateRequest request) {
        User user = findUserOrThrow(userId);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());
        if (request.getEmailVerified() != null) user.setEmailVerified(request.getEmailVerified());

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    /**
     * Người dùng tự thay đổi mật khẩu.
     */
    @Transactional
    public void changePassword(Long userId, UserChangePasswordRequest request, UserPrincipal currentUser) {
        // 1. Xác thực người dùng: chỉ có thể tự đổi mật khẩu của chính mình
        if (!userId.equals(currentUser.getId())) {
            throw new AppException("Bạn không có quyền thay đổi mật khẩu của người dùng này", HttpStatus.FORBIDDEN);
        }

        User user = findUserOrThrow(userId);

        // 2. Kiểm tra mật khẩu cũ có khớp không
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException("Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST);
        }

        // --- SỬA LỖI QUAN TRỌNG NHẤT NẰM Ở ĐÂY ---
        // 3. Mã hóa mật khẩu mới trước khi lưu
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    /**
     * Lấy danh sách các giảng viên tiêu biểu.
     * @param limit Số lượng giảng viên muốn lấy.
     * @return Danh sách PopularInstructorResponse.
     */
    @Transactional(readOnly = true)
    public List<PopularInstructorResponse> getPopularInstructors(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return userRepository.findPopularInstructors(pageable);
    }

    // --- Helper Methods ---
    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID: " + id, HttpStatus.NOT_FOUND));
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(user, userResponse, "password"); // Copy các thuộc tính, loại trừ password
        return userResponse;
    }


}