package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartAddRequest {

    @NotNull(message = "ID khóa học không được để trống")
    private Long courseId;
}