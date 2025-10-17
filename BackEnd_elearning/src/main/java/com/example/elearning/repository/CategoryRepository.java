package com.example.elearning.repository;


import com.example.elearning.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentIdIsNull();  // Lấy categories gốc

    List<Category> findByParentId(Long parentId);  // Lấy categories con
}
