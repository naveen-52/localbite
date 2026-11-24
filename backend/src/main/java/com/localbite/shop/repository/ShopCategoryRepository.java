package com.localbite.shop.repository;

import com.localbite.shop.entity.ShopCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopCategoryRepository extends JpaRepository<ShopCategory, Long> {
    Optional<ShopCategory> findBySlug(String slug);
    List<ShopCategory> findByActiveTrueOrderByDisplayOrderAsc();
}
