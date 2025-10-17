package com.example.elearning.dto.request;

import com.example.elearning.enums.CourseLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseCreateRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 200, message = "Tiêu đề không vượt quá 200 ký tự")
    private String title;

    @Size(max = 500, message = "Mô tả ngắn không vượt quá 500 ký tự")
    private String shortDescription;

    private String description;

    private String thumbnail;

    private String previewVideo;

    private CourseLevel level = CourseLevel.BEGINNER;

    private BigDecimal price;  // ✅ BigDecimal

    private Boolean isFree = true;

    private String requirements;

    private String objectives;
}