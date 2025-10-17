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
    private Integer totalDuration = 0;  // Tổng thời lượng (phút)

    @Column(nullable = false)
    private Integer enrollmentCount = 0;

    // ✅ FIX - Đổi từ Double sang BigDecimal
    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer reviewCount = 0;

    // Foreign key
    @Column(name = "instructor_id", nullable = false)
    private Long instructorId;

    @Column(name = "approved_by")
    private Long approvedBy;

    // ✅ CẢI THIỆN - Dùng @CreationTimestamp/@UpdateTimestamp thay vì @PrePersist
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime approvedAt;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    @OrderBy("orderIndex ASC") // Luôn sắp xếp các chương theo thứ tự
    private List<Chapter> chapters;
}