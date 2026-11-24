package com.localbite.food.dto;

import com.localbite.food.entity.AvailabilityStatus;
import java.time.Instant;

public class AvailabilityEventDto {

    private Long foodItemId;
    private Long shopId;
    private String foodName;
    private AvailabilityStatus status;
    private Integer remainingQuantity;
    private Instant updatedAt;

    public AvailabilityEventDto() {
    }

    public AvailabilityEventDto(Long foodItemId, Long shopId, String foodName, AvailabilityStatus status, Integer remainingQuantity, Instant updatedAt) {
        this.foodItemId = foodItemId;
        this.shopId = shopId;
        this.foodName = foodName;
        this.status = status;
        this.remainingQuantity = remainingQuantity;
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }

    public Integer getRemainingQuantity() {
        return remainingQuantity;
    }

    public void setRemainingQuantity(Integer remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
