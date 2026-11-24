package com.localbite.shop.repository;

import com.localbite.shop.entity.ShopHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShopHolidayRepository extends JpaRepository<ShopHoliday, Long> {
    List<ShopHoliday> findByShopIdAndHolidayDateGreaterThanEqual(Long shopId, LocalDate fromDate);
    boolean existsByShopIdAndHolidayDate(Long shopId, LocalDate holidayDate);
}
