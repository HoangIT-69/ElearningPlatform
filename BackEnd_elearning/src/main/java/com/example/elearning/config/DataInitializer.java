package com.example.elearning.config;

import com.example.elearning.entity.User;
import com.example.elearning.enums.Role;
import com.example.elearning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem admin đã tồn tại chưa
        if (!userRepository.existsByEmail("admin@elearning.com")) {
            User admin = new User();
            admin.setEmail("admin@elearning.com");
            admin.setPassword(passwordEncoder.encode("adminpassword")); // Tự động mã hóa
            admin.setFullName("Super Admin");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true); // Mặc định là đã xác thực cho tiện

            userRepository.save(admin);
            System.out.println(">>>> Created default ADMIN user!");
        }

        // Bạn có thể tạo thêm instructor tại đây nếu muốn
        if (!userRepository.existsByEmail("instructor@elearning.com")) {
            User instructor = new User();
            instructor.setEmail("instructor@elearning.com");
            instructor.setPassword(passwordEncoder.encode("instrpassword"));
            instructor.setFullName("Default Instructor");
            instructor.setRole(Role.INSTRUCTOR);
            instructor.setIsActive(true);
            instructor.setEmailVerified(true);

            userRepository.save(instructor);
            System.out.println(">>>> Created default INSTRUCTOR user!");
        }
    }
}