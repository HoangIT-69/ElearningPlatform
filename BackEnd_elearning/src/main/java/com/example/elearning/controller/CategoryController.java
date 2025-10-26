package com.example.elearning.controller;

import com.example.elearning.dto.request.CategoryRequest;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.CategoryTreeResponse; // <-- THÊM IMPORT NÀY
import com.example.elearning.entity.Category;
import com.example.elearning.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "🗂️ Category Management", description = "APIs quản lý danh mục khóa học")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Operation(summary = "Lấy tất cả danh mục (dạng danh sách phẳng, Public)")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    // === ENDPOINT MỚI VÀ QUAN TRỌNG NHẤT CHO UI ===
    @Operation(summary = "Lấy toàn bộ cây danh mục (dạng cha-con lồng nhau, Public)")
    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<List<CategoryTreeResponse>>> getCategoryTree() {
        List<CategoryTreeResponse> categoryTree = categoryService.getCategoryTree();
        return ResponseEntity.ok(ApiResponse.success(categoryTree));
    }

    @Operation(summary = "Lấy một danh mục theo ID (Public)")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategory(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @Operation(summary = "Tạo danh mục mới (Yêu cầu quyền ADMIN)")
    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category newCategory = categoryService.createCategory(request);
        return ResponseEntity.ok(ApiResponse.success(newCategory, "Tạo danh mục thành công"));
    }

    @Operation(summary = "Cập nhật danh mục (Yêu cầu quyền ADMIN)")
    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        Category updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedCategory, "Cập nhật danh mục thành công"));
    }

    @Operation(summary = "Xóa danh mục (Yêu cầu quyền ADMIN)")
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa danh mục thành công"));
    }
}