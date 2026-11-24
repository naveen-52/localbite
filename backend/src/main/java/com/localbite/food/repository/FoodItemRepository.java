package com.localbite.food.repository;

import com.localbite.food.entity.AvailabilityStatus;
import com.localbite.food.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByShopIdAndEnabledTrue(Long shopId);
    List<FoodItem> findByShopIdAndAvailabilityStatusAndEnabledTrue(Long shopId, AvailabilityStatus status);
    List<FoodItem> findByShopId(Long shopId);
}
