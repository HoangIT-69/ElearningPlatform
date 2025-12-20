package com.example.elearning.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    // --- BỎ THUỘC TÍNH `courseId` RIÊNG LẺ ---
    // @Column(name = "course_id", nullable = false)
    // private Long courseId;

    // --- THAY BẰNG MỐI QUAN HỆ ĐỐI TƯỢNG @ManyToOne ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore // Ngăn lỗi lặp vô hạn khi API trả về JSON
    private Course course;
    // ----------------------------------------------------

    // Mối quan hệ: Một Chapter có nhiều Lesson (thiết lập 2 chiều)
    @OneToMany(
            mappedBy = "chapter", // "chapter" là tên thuộc tính trong Lesson Entity
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    @OrderBy("orderIndex ASC")
    private List<Lesson> lessons = new ArrayList<>();

    @CreationTimestamp // Dùng annotation cho gọn
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Helper method để đồng bộ hóa
    public void addLesson(Lesson lesson) {
        lessons.add(lesson);
        lesson.setChapter(this);
    }

    public void removeLesson(Lesson lesson) {
        lessons.remove(lesson);
        lesson.setChapter(null);
    }
}