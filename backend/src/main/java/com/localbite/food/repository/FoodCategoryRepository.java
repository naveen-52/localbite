package com.localbite.food.repository;

import com.localbite.food.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {
    List<FoodCategory> findByShopIdIsNullOrderByDisplayOrderAsc();
    List<FoodCategory> findByShopIdOrderByDisplayOrderAsc(Long shopId);
}
