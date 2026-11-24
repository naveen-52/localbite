package com.localbite.shop.repository;

import com.localbite.shop.entity.ShopBusinessHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopBusinessHoursRepository extends JpaRepository<ShopBusinessHours, Long> {
    List<ShopBusinessHours> findByShopIdOrderByDayOfWeekAsc(Long shopId);
    Optional<ShopBusinessHours> findByShopIdAndDayOfWeek(Long shopId, int dayOfWeek);
    void deleteByShopId(Long shopId);
}
