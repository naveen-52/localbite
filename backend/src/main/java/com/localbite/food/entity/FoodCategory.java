package com.localbite.food.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "food_categories")
public class FoodCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_id")
    private Long shopId;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(name = "meal_type", nullable = false, length = 30)
    private String mealType = "ALL_DAY"; // BREAKFAST, LUNCH, SNACKS, DINNER, BEVERAGES, ALL_DAY

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    public FoodCategory() {
    }

    public FoodCategory(Long id, Long shopId, String name, String mealType, int displayOrder) {
        this.id = id;
        this.shopId = shopId;
        this.name = name;
        this.mealType = mealType;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
