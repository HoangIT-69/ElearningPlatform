package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LessonCreateRequest {
    @NotBlank(message = "Tiêu đề bài học không được để trống")
    private String title;

    private String videoUrl;

    private Integer videoDuration; // tính bằng giây

    @NotNull(message = "ID chương không được để trống")
    private Long chapterId;

    private Boolean isFree = false;
}