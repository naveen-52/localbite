package com.localbite.shop.dto;

import java.math.BigDecimal;

public class NearbyShopDto {
    private Long id;
    private String name;
    private String slug;
    private String categoryName;
    private String addressLine;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String profileImageUrl;
    private String bannerImageUrl;
    private double distanceKm;
    private boolean open;
    private String statusMessage;
    private int availableItemCount;

    public NearbyShopDto() {
    }

    public NearbyShopDto(Long id, String name, String slug, String categoryName, String addressLine, BigDecimal latitude, BigDecimal longitude, String profileImageUrl, double distanceKm, boolean open, String statusMessage, int availableItemCount) {
        this(id, name, slug, categoryName, addressLine, latitude, longitude, profileImageUrl, null, distanceKm, open, statusMessage, availableItemCount);
    }

    public NearbyShopDto(Long id, String name, String slug, String categoryName, String addressLine, BigDecimal latitude, BigDecimal longitude, String profileImageUrl, String bannerImageUrl, double distanceKm, boolean open, String statusMessage, int availableItemCount) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.categoryName = categoryName;
        this.addressLine = addressLine;
        this.latitude = latitude;
        this.longitude = longitude;
        this.profileImageUrl = profileImageUrl;
        this.bannerImageUrl = bannerImageUrl;
        this.distanceKm = Math.round(distanceKm * 10.0) / 10.0;
        this.open = open;
        this.statusMessage = statusMessage;
        this.availableItemCount = availableItemCount;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public boolean isOpen() {
        return open;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public int getAvailableItemCount() {
        return availableItemCount;
    }
}
