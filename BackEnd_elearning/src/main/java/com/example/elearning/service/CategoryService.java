package com.example.elearning.service;

import com.example.elearning.dto.request.CategoryRequest;
import com.example.elearning.dto.response.CategoryTreeResponse;
import com.example.elearning.entity.Category;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.CategoryRepository;
import com.example.elearning.repository.CourseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseCategoryRepository courseCategoryRepository;

    // --- CÁC PHƯƠƠNG THỨC LẤY DỮ LIỆU ---

    /**
     * Lấy tất cả danh mục dưới dạng danh sách phẳng, đã sắp xếp.
     * Hữu ích cho việc hiển thị trong trang admin.
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByOrderIndexAsc();
    }

    /**
     * Lấy toàn bộ danh mục dưới dạng cây (cha-con lồng nhau).
     * Tối ưu cho việc hiển thị menu hoặc bộ lọc phân cấp trên frontend.
     */
    public List<CategoryTreeResponse> getCategoryTree() {
        // 1. Lấy tất cả danh mục từ DB, đã được sắp xếp
        List<Category> allCategories = categoryRepository.findAllByOrderByOrderIndexAsc();

        // 2. Chuyển đổi tất cả Entity sang DTO và đưa vào một Map để tra cứu nhanh
        Map<Long, CategoryTreeResponse> map = new HashMap<>();
        allCategories.forEach(cat -> map.put(cat.getId(),
                new CategoryTreeResponse(cat.getId(), cat.getName(), cat.getSlug(), cat.getParentId())));

        // 3. Xây dựng cấu trúc cây
        List<CategoryTreeResponse> tree = new ArrayList<>();
        map.values().forEach(dto -> {
            // --- SỬA LỖI LOGIC Ở ĐÂY ---
            // Coi danh mục là gốc nếu parentId là NULL hoặc bằng 0
            if (dto.getParentId() == null || dto.getParentId() == 0) {
                tree.add(dto);
            } else {
                // Nếu là danh mục con, tìm cha của nó trong map và thêm mình vào danh sách 'children' của cha
                CategoryTreeResponse parent = map.get(dto.getParentId());
                if (parent != null) {
                    parent.getChildren().add(dto);
                }
            }
        });

        return tree;
    }


    /**
     * Lấy chi tiết một danh mục theo ID.
     */
    public Category getCategory(Long id) {
        return findCategoryOrThrow(id);
    }

    // --- CÁC PHƯƠNG THỨC GHI DỮ LIỆU (YÊU CẦU QUYỀN ADMIN) ---

    @Transactional
    public Category createCategory(CategoryRequest request) {
        String slug = generateSlug(request.getName());
        categoryRepository.findBySlug(slug).ifPresent(c -> {
            throw new AppException("Tên danh mục này đã tồn tại", HttpStatus.BAD_REQUEST);
        });

        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setParentId(request.getParentId());
        category.setOrderIndex(request.getOrderIndex());

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = findCategoryOrThrow(id);

        if (id.equals(request.getParentId())) {
            throw new AppException("Một danh mục không thể tự làm cha của chính nó.", HttpStatus.BAD_REQUEST);
        }

        String newSlug = generateSlug(request.getName());
        categoryRepository.findBySlug(newSlug).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new AppException("Tên danh mục mới đã được sử dụng", HttpStatus.BAD_REQUEST);
            }
        });

        category.setName(request.getName());
        category.setSlug(newSlug);
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setParentId(request.getParentId());
        category.setOrderIndex(request.getOrderIndex());

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = findCategoryOrThrow(id);

        if (!courseCategoryRepository.findByCategoryId(id).isEmpty()) {
            throw new AppException("Không thể xóa: Danh mục đang được gán cho khóa học.", HttpStatus.BAD_REQUEST);
        }

        if (categoryRepository.existsByParentId(id)) {
            throw new AppException("Không thể xóa: Danh mục này đang chứa các danh mục con.", HttpStatus.BAD_REQUEST);
        }

        categoryRepository.delete(category);
    }

    // --- CÁC PHƯƠNG THỨC HỖ TRỢ ---

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy danh mục với ID: " + id, HttpStatus.NOT_FOUND));
    }

    private String generateSlug(String name) {
        if (name == null) return "";
        String slug = name.toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9\\-]", "");
        return slug.replaceAll("-+", "-").trim();
    }
}