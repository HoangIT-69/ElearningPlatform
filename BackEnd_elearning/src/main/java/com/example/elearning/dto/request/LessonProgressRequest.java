package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LessonProgressRequest {

    @NotNull(message = "ID khóa học không được để trống")
    private Long courseId; // Cần courseId để tìm ra enrollment tương ứng

    @NotNull(message = "ID bài học không được để trống")
    private Long lessonId;

    // Frontend sẽ gửi lên true khi người dùng nhấn nút "Hoàn thành bài học"
    private Boolean completed;
}