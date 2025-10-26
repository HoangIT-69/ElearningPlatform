package com.example.elearning.repository;

import com.example.elearning.entity.Course;
import com.example.elearning.entity.CourseCategory;
import com.example.elearning.enums.CourseLevel;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.beans.factory.annotation.Autowired; // <-- THÊM IMPORT NÀY
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CourseSpecification {

    // --- SỬA LỖI Ở ĐÂY ---

    // 1. Khai báo biến là final để đảm bảo nó phải được khởi tạo
    private final CategoryRepository categoryRepository;

    // 2. Tạo constructor và dùng @Autowired ở đây
    @Autowired
    public CourseSpecification(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // --- KẾT THÚC SỬA LỖI ---


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

    public Specification<Course> hasCategory(Long categoryId) {
        // 1. Lấy categoryId và tất cả các ID con cháu của nó
        List<Long> categoryIds = categoryRepository.findSelfAndAllDescendantIds(categoryId);

        return (root, query, criteriaBuilder) -> {
            if (categoryIds == null || categoryIds.isEmpty()) {
                // Trả về một điều kiện luôn sai nếu không tìm thấy category nào
                return criteriaBuilder.disjunction();
            }

            // 2. Tạo subquery để tìm các courseId thuộc về BẤT KỲ categoryId nào trong danh sách
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<CourseCategory> subqueryRoot = subquery.from(CourseCategory.class);
            subquery.select(subqueryRoot.get("courseId"))
                    .where(subqueryRoot.get("categoryId").in(categoryIds)); // Dùng "IN"

            // 3. Điều kiện cuối cùng: id của Course phải nằm trong danh sách từ subquery
            return root.get("id").in(subquery);
        };
    }
}