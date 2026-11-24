package com.localbite.food.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "food_availability_history")
public class FoodAvailabilityHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_item_id", nullable = false)
    private Long foodItemId;

    @Column(name = "previous_status", nullable = false, length = 20)
    private String previousStatus;

    @Column(name = "new_status", nullable = false, length = 20)
    private String newStatus;

    @Column(name = "previous_quantity")
    private Integer previousQuantity;

    @Column(name = "new_quantity")
    private Integer newQuantity;

    @Column(name = "changed_by", nullable = false)
    private Long changedBy;

    @CreationTimestamp
    @Column(name = "changed_at", nullable = false, updatable = false)
    private Instant changedAt;

    public FoodAvailabilityHistory() {
    }

    public FoodAvailabilityHistory(Long foodItemId, String previousStatus, String newStatus, Integer previousQuantity, Integer newQuantity, Long changedBy) {
        this.foodItemId = foodItemId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.previousQuantity = previousQuantity;
        this.newQuantity = newQuantity;
        this.changedBy = changedBy;
    }

    public Long getId() {
        return id;
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public Integer getPreviousQuantity() {
        return previousQuantity;
    }

    public Integer getNewQuantity() {
        return newQuantity;
    }

    public Long getChangedBy() {
        return changedBy;
    }

    public Instant getChangedAt() {
        return changedAt;
    }
}
