package com.example.elearning.service;

import com.example.elearning.dto.request.LoginRequest;
import com.example.elearning.dto.request.RegisterRequest;
import com.example.elearning.dto.response.AuthResponse;
import com.example.elearning.entity.User;
import com.example.elearning.enums.Role;
import com.example.elearning.exception.BadRequestException;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        // Validate password strength (optional)
        validatePassword(request.getPassword());

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(Role.STUDENT);
        user.setIsActive(true);
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getId()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(
                savedUser.getEmail()
        );

        return buildAuthResponse(savedUser, accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email hoặc mật khẩu không đúng"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }

        // Check active status
        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        // Generate tokens
        String accessToken = jwtTokenProvider.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(
                user.getEmail()
        );

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(String refreshToken) {
        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        // Get email from token
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Generate new access token
        String newAccessToken = jwtTokenProvider.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId()
        );

        return buildAuthResponse(user, newAccessToken, refreshToken);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    private void validatePassword(String password) {
        if (password.length() < 8) {
            throw new BadRequestException("Mật khẩu phải có ít nhất 8 ký tự");
        }
        // Thêm các rule khác nếu cần
    }
}