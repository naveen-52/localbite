package com.localbite.food.dto;

import com.localbite.food.entity.AvailabilityStatus;
import com.localbite.food.entity.FoodItem;

import java.math.BigDecimal;
import java.time.Instant;

public class FoodItemDto {
    private Long id;
    private Long shopId;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String regionalName;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private AvailabilityStatus availabilityStatus;
    private boolean quantityTracked;
    private int currentQuantity;
    private boolean enabled;
    private Instant updatedAt;

    public FoodItemDto() {
    }

    public static FoodItemDto fromEntity(FoodItem item) {
        FoodItemDto dto = new FoodItemDto();
        dto.id = item.getId();
        dto.shopId = item.getShopId();
        if (item.getCategory() != null) {
            dto.categoryId = item.getCategory().getId();
            dto.categoryName = item.getCategory().getName();
        }
        dto.name = item.getName();
        dto.regionalName = item.getRegionalName();
        dto.description = item.getDescription();
        dto.price = item.getPrice();
        dto.imageUrl = item.getImageUrl();
        dto.availabilityStatus = item.getAvailabilityStatus();
        dto.quantityTracked = item.isQuantityTracked();
        dto.currentQuantity = item.getCurrentQuantity();
        dto.enabled = item.isEnabled();
        dto.updatedAt = item.getUpdatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getShopId() {
        return shopId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getName() {
        return name;
    }

    public String getRegionalName() {
        return regionalName;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public boolean isQuantityTracked() {
        return quantityTracked;
    }

    public int getCurrentQuantity() {
        return currentQuantity;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
