package com.example.elearning.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chapters")
@Data
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    // Mối quan hệ: Một Chapter có nhiều Lesson
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "chapter_id", referencedColumnName = "id")
    @OrderBy("orderIndex ASC") // Luôn sắp xếp các bài học theo thứ tự
    private List<Lesson> lessons;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}