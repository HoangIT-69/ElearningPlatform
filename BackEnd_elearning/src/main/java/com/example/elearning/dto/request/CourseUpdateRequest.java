package com.example.elearning.dto.request;

import com.example.elearning.enums.CourseLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseUpdateRequest {
    private String title;
    private String shortDescription;
    private String description;
    private String thumbnail;
    private String previewVideo;
    private CourseLevel level;
    private BigDecimal price;  // ✅ BigDecimal
    private Boolean isFree;
    private String requirements;
    private String objectives;
}