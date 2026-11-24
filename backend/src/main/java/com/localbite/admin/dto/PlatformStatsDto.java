package com.localbite.admin.dto;

import java.math.BigDecimal;

public class PlatformStatsDto {
    private long totalCustomers;
    private long totalShopOwners;
    private long activeShops;
    private long pendingShops;
    private long suspendedShops;
    private BigDecimal totalRevenue;

    public PlatformStatsDto() {
    }

    public PlatformStatsDto(long totalCustomers, long totalShopOwners, long activeShops, long pendingShops, long suspendedShops, BigDecimal totalRevenue) {
        this.totalCustomers = totalCustomers;
        this.totalShopOwners = totalShopOwners;
        this.activeShops = activeShops;
        this.pendingShops = pendingShops;
        this.suspendedShops = suspendedShops;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public long getTotalShopOwners() {
        return totalShopOwners;
    }

    public long getActiveShops() {
        return activeShops;
    }

    public long getPendingShops() {
        return pendingShops;
    }

    public long getSuspendedShops() {
        return suspendedShops;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}
