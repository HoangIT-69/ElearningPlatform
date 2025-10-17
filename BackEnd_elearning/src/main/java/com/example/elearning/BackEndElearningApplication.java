package com.example.elearning;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// --- BẮT ĐẦU PHẦN THÊM MỚI ---
@OpenAPIDefinition(info = @Info(
		title = "E-Learning API",
		version = "1.0",
		description = "Documentation for E-Learning Backend APIs"
))
@SecurityScheme(
		name = "bearerAuth", // Tên này phải khớp với tên trong @SecurityRequirement
		scheme = "bearer",
		bearerFormat = "JWT",
		type = SecuritySchemeType.HTTP,
		in = SecuritySchemeIn.HEADER,
		description = "Enter your JWT token in this format: Bearer <token>"
)
// --- KẾT THÚC PHẦN THÊM MỚI ---
public class BackEndElearningApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackEndElearningApplication.class, args);
	}

}