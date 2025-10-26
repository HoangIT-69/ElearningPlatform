package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LessonUpdateRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    private String videoUrl;
    private Integer videoDuration;
    private Boolean isFree;
}