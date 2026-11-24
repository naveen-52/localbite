package com.localbite.food.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_id", nullable = false)
    private Long shopId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private FoodCategory category;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "regional_name", length = 100)
    private String regionalName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false, length = 20)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "is_quantity_tracked", nullable = false)
    private boolean quantityTracked = false;

    @Column(name = "current_quantity", nullable = false)
    private int currentQuantity = 0;

    @Column(name = "is_enabled", nullable = false)
    private boolean enabled = true;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public FoodItem() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long shopId;
        private FoodCategory category;
        private String name;
        private String regionalName;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;
        private boolean quantityTracked = false;
        private int currentQuantity = 0;
        private boolean enabled = true;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder shopId(Long shopId) {
            this.shopId = shopId;
            return this;
        }

        public Builder category(FoodCategory category) {
            this.category = category;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder regionalName(String regionalName) {
            this.regionalName = regionalName;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder availabilityStatus(AvailabilityStatus availabilityStatus) {
            this.availabilityStatus = availabilityStatus;
            return this;
        }

        public Builder quantityTracked(boolean quantityTracked) {
            this.quantityTracked = quantityTracked;
            return this;
        }

        public Builder currentQuantity(int currentQuantity) {
            this.currentQuantity = currentQuantity;
            return this;
        }

        public Builder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public FoodItem build() {
            FoodItem item = new FoodItem();
            item.id = this.id;
            item.shopId = this.shopId;
            item.category = this.category;
            item.name = this.name;
            item.regionalName = this.regionalName;
            item.description = this.description;
            item.price = this.price;
            item.imageUrl = this.imageUrl;
            item.availabilityStatus = this.availabilityStatus;
            item.quantityTracked = this.quantityTracked;
            item.currentQuantity = this.currentQuantity;
            item.enabled = this.enabled;
            return item;
        }
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

    public FoodCategory getCategory() {
        return category;
    }

    public void setCategory(FoodCategory category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegionalName() {
        return regionalName;
    }

    public void setRegionalName(String regionalName) {
        this.regionalName = regionalName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public boolean isQuantityTracked() {
        return quantityTracked;
    }

    public void setQuantityTracked(boolean quantityTracked) {
        this.quantityTracked = quantityTracked;
    }

    public int getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(int currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Long getVersion() {
        return version;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
