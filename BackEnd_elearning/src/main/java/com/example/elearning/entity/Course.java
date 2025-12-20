package com.example.elearning.entity;

import com.example.elearning.enums.CourseLevel;
import com.example.elearning.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList; // Thêm import này
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnail;

    private String previewVideo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseLevel level = CourseLevel.BEGINNER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseStatus status = CourseStatus.DRAFT;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean isFree = true;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(nullable = false)
    private Integer totalDuration = 0;

    @Column(nullable = false)
    private Integer enrollmentCount = 0;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer reviewCount = 0;

    @Column(name = "instructor_id", nullable = false)
    private Long instructorId;

    @Column(name = "approved_by")
    private Long approvedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime approvedAt;

    // --- SỬA LẠI HOÀN TOÀN KHỐI NÀY ---
    @OneToMany(
            mappedBy = "course", // Chỉ định "course" là thuộc tính quản lý trong Chapter
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true // Tự động xóa Chapter con khi nó bị gỡ khỏi list
    )
    // XÓA DÒNG @JoinColumn KHỎI ĐÂY
    @OrderBy("orderIndex ASC")
    private List<Chapter> chapters = new ArrayList<>();
}
