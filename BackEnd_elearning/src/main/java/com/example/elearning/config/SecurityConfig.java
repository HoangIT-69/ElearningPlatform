package com.example.elearning.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.elearning.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // Danh sách các đường dẫn công khai, bao gồm cả Swagger
    private static final String[] PUBLIC_URLS = {
            "/api/auth/**",
            // -- Swagger UI v3 (OpenAPI)
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập các đường dẫn công khai đã định nghĩa ở trên
                        .requestMatchers(PUBLIC_URLS).permitAll()

                        // Ai cũng có thể xem (GET) khóa học
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()

                        // Chỉ INSTRUCTOR và ADMIN mới có quyền tạo, sửa, xóa, publish khóa học
                        .requestMatchers(HttpMethod.POST, "/api/courses/**").hasAnyAuthority("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyAuthority("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyAuthority("INSTRUCTOR", "ADMIN")

                        // Tất cả các request còn lại đều yêu cầu phải xác thực
                        .anyRequest().authenticated()
                );

        // Thêm JWT filter vào chuỗi filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}