package com.example.elearning.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // Thêm NoArgsConstructor
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor // Lombok sẽ tạo constructor rỗng
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "video_duration")
    private Integer videoDuration; // tính bằng giây

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "is_free", nullable = false)
    private Boolean isFree = false;

    // --- BỎ THUỘC TÍNH `chapterId` RIÊNG LẺ ---
    // @Column(name = "chapter_id", nullable = false)
    // private Long chapterId;

    // --- THAY BẰNG MỐI QUAN HỆ ĐỐI TƯỢNG @ManyToOne ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    @JsonIgnore // Ngăn lỗi lặp vô hạn khi API trả về JSON
    private Chapter chapter;
    // ----------------------------------------------------

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}