package com.localbite.shop.dto;

import java.time.LocalTime;

public class ShopStatusDto {
    private boolean open;
    private String statusMessage;
    private LocalTime nextOpenTime;
    private LocalTime currentClosingTime;

    public ShopStatusDto() {
    }

    public ShopStatusDto(boolean open, String statusMessage, LocalTime nextOpenTime, LocalTime currentClosingTime) {
        this.open = open;
        this.statusMessage = statusMessage;
        this.nextOpenTime = nextOpenTime;
        this.currentClosingTime = currentClosingTime;
    }

    public static ShopStatusDto open(String message, LocalTime closingTime) {
        return new ShopStatusDto(true, message, null, closingTime);
    }

    public static ShopStatusDto closed(String message, LocalTime nextOpen) {
        return new ShopStatusDto(false, message, nextOpen, null);
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public LocalTime getNextOpenTime() {
        return nextOpenTime;
    }

    public void setNextOpenTime(LocalTime nextOpenTime) {
        this.nextOpenTime = nextOpenTime;
    }

    public LocalTime getCurrentClosingTime() {
        return currentClosingTime;
    }

    public void setCurrentClosingTime(LocalTime currentClosingTime) {
        this.currentClosingTime = currentClosingTime;
    }
}
