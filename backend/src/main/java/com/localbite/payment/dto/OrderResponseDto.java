package com.localbite.payment.dto;

import java.math.BigDecimal;

public class OrderResponseDto {

    private String transactionRef;
    private String gatewayOrderId;
    private String razorpayKeyId;
    private BigDecimal amount;
    private String currency;
    private String planTitle;
    private String shopName;

    public OrderResponseDto() {
    }

    public OrderResponseDto(String transactionRef, String gatewayOrderId, String razorpayKeyId, BigDecimal amount, String currency, String planTitle, String shopName) {
        this.transactionRef = transactionRef;
        this.gatewayOrderId = gatewayOrderId;
        this.razorpayKeyId = razorpayKeyId;
        this.amount = amount;
        this.currency = currency;
        this.planTitle = planTitle;
        this.shopName = shopName;
    }

    public String getTransactionRef() {
        return transactionRef;
    }

    public String getGatewayOrderId() {
        return gatewayOrderId;
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getPlanTitle() {
        return planTitle;
    }

    public String getShopName() {
        return shopName;
    }
}
