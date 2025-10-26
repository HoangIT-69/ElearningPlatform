package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChapterUpdateRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
}