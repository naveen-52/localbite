package com.localbite.shop.entity;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "shop_business_hours", uniqueConstraints = {
        @UniqueConstraint(name = "uq_shop_day", columnNames = {"shop_id", "day_of_week"})
})
public class ShopBusinessHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_id", nullable = false)
    private Long shopId;

    @Column(name = "day_of_week", nullable = false)
    private int dayOfWeek; // 1 = Monday ... 7 = Sunday

    @Column(name = "open_time", nullable = false)
    private LocalTime openTime;

    @Column(name = "close_time", nullable = false)
    private LocalTime closeTime;

    @Column(name = "is_closed", nullable = false)
    private boolean closed = false;

    public ShopBusinessHours() {
    }

    public ShopBusinessHours(Long id, Long shopId, int dayOfWeek, LocalTime openTime, LocalTime closeTime, boolean closed) {
        this.id = id;
        this.shopId = shopId;
        this.dayOfWeek = dayOfWeek;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.closed = closed;
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

    public int getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(int dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalTime closeTime) {
        this.closeTime = closeTime;
    }

    public boolean isClosed() {
        return closed;
    }

    public void setClosed(boolean closed) {
        this.closed = closed;
    }
}
