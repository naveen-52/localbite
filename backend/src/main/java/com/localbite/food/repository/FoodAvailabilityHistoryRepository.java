package com.localbite.food.repository;

import com.localbite.food.entity.FoodAvailabilityHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodAvailabilityHistoryRepository extends JpaRepository<FoodAvailabilityHistory, Long> {
    List<FoodAvailabilityHistory> findByFoodItemIdOrderByChangedAtDesc(Long foodItemId);
}
