package com.example.elearning.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.elearning.security.JwtAuthenticationFilter;
import org.springframework.http.HttpMethod;
// THÊM IMPORT NÀY
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // <-- THÊM ANNOTATION NÀY ĐỂ @PreAuthorize HOẠT ĐỘNG
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Các endpoints công khai không cần token
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/auth/**"
                        ).permitAll()

                        // Ai cũng có thể xem (GET) khóa học VÀ DANH MỤC
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll() // <-- THÊM DÒNG NÀY

                        // Các endpoints cần quyền INSTRUCTOR hoặc ADMIN (ví dụ)
                        .requestMatchers(HttpMethod.POST, "/api/courses/**").hasAnyAuthority("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyAuthority("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyAuthority("INSTRUCTOR", "ADMIN")

                        // Các API quản lý Chapter, Lesson, Course-Category...
                        // Chúng ta sẽ dùng @PreAuthorize nên không cần định nghĩa ở đây nữa
                        .requestMatchers("/api/chapters/**").authenticated()
                        .requestMatchers("/api/lessons/**").authenticated()
                        .requestMatchers("/api/course-categories/**").authenticated()

                        // Tất cả các request còn lại đều yêu cầu phải xác thực
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}