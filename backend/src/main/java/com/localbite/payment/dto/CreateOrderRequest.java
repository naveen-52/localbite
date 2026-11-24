package com.localbite.payment.dto;

import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {

    @NotNull(message = "Shop ID is required")
    private Long shopId;

    @NotNull(message = "Plan ID is required")
    private Long planId;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(Long shopId, Long planId) {
        this.shopId = shopId;
        this.planId = planId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }
}
