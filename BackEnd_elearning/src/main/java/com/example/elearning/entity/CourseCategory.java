package com.example.elearning.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "course_categories",
        uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "category_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;
}
