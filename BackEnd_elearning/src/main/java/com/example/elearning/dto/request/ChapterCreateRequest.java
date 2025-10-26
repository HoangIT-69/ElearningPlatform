package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChapterCreateRequest {
    @NotBlank(message = "Tiêu đề chương không được để trống")
    private String title;

    @NotNull(message = "ID khóa học không được để trống")
    private Long courseId;
}