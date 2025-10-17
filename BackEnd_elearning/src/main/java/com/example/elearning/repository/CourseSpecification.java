package com.example.elearning.repository;

import com.example.elearning.entity.Course;
import com.example.elearning.enums.CourseLevel;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class CourseSpecification {

    public Specification<Course> hasStatusPublished() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), com.example.elearning.enums.CourseStatus.PUBLISHED);
    }

    public Specification<Course> titleOrDescriptionContains(String keyword) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("shortDescription")), "%" + keyword.toLowerCase() + "%")
                );
    }

    public Specification<Course> hasLevel(CourseLevel level) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("level"), level);
    }

    public Specification<Course> isFree(Boolean isFree) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isFree"), isFree);
    }
}