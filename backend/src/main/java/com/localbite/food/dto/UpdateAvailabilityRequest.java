package com.localbite.food.dto;

import com.localbite.food.entity.AvailabilityStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateAvailabilityRequest {

    @NotNull(message = "Availability status is required (AVAILABLE, LIMITED, SOLD_OUT)")
    private AvailabilityStatus status;

    private Integer quantity;

    public UpdateAvailabilityRequest() {
    }

    public UpdateAvailabilityRequest(AvailabilityStatus status, Integer quantity) {
        this.status = status;
        this.quantity = quantity;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
