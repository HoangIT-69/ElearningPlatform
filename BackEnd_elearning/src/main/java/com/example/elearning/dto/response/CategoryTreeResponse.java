package com.example.elearning.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class CategoryTreeResponse {
    private Long id;
    private String name;
    private String slug;
    private Long parentId;
    private List<CategoryTreeResponse> children = new ArrayList<>();

    // Constructor để dễ dàng chuyển đổi từ Entity
    public CategoryTreeResponse(Long id, String name, String slug, Long parentId) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.parentId = parentId;
    }
}