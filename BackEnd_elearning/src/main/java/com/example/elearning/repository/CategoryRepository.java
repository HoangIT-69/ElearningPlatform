package com.example.elearning.repository;

import com.example.elearning.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Tìm một danh mục bằng slug.
     */
    Optional<Category> findBySlug(String slug);

    /**
     * Tìm tất cả các danh mục và sắp xếp theo thứ tự.
     */
    List<Category> findAllByOrderByOrderIndexAsc();

    /**
     * Tìm các danh mục con trực tiếp của một danh mục cha, sắp xếp theo thứ tự.
     */
    List<Category> findByParentIdOrderByOrderIndexAsc(Long parentId);

    /**
     * Tìm tất cả các danh mục gốc (không có cha), sắp xếp theo thứ tự.
     */
    List<Category> findByParentIdIsNullOrderByOrderIndexAsc();

    /**
     * Kiểm tra xem có danh mục con nào tồn tại cho một danh mục cha hay không.
     */
    boolean existsByParentId(Long parentId);

    // =================================================================
    // PHƯƠNG THỨC MỚI ĐƯỢC THÊM VÀO
    // =================================================================
    /**
     * Lấy ID của chính danh mục được cung cấp và tất cả các ID con cháu của nó.
     * Phương thức này sử dụng câu lệnh đệ quy (Recursive CTE) của SQL để duyệt qua cây danh mục.
     * @param categoryId ID của danh mục cha bắt đầu.
     * @return Một danh sách các Long chứa ID của danh mục cha và tất cả các con cháu.
     */
    @Query(value = "WITH RECURSIVE subcategories AS (" +
            "    SELECT id FROM categories WHERE id = :categoryId" +
            "    UNION ALL" +
            "    SELECT c.id FROM categories c JOIN subcategories s ON c.parent_id = s.id" +
            ") SELECT id FROM subcategories", nativeQuery = true)
    List<Long> findSelfAndAllDescendantIds(@Param("categoryId") Long categoryId);
}