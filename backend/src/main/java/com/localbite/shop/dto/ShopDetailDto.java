package com.localbite.shop.dto;

import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.VerificationStatus;

import java.math.BigDecimal;

public class ShopDetailDto {
    private Long id;
    private Long ownerId;
    private String categoryName;
    private String name;
    private String slug;
    private String description;
    private String phoneNumber;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String bannerImageUrl;
    private String profileImageUrl;
    private VerificationStatus verificationStatus;
    private boolean temporarilyClosed;
    private String closureReason;
    private ShopStatusDto statusInfo;

    public ShopDetailDto() {
    }

    public static ShopDetailDto fromEntity(Shop shop, ShopStatusDto statusInfo) {
        ShopDetailDto dto = new ShopDetailDto();
        dto.id = shop.getId();
        dto.ownerId = shop.getOwnerId();
        if (shop.getCategory() != null) {
            dto.categoryName = shop.getCategory().getName();
        }
        dto.name = shop.getName();
        dto.slug = shop.getSlug();
        dto.description = shop.getDescription();
        dto.phoneNumber = shop.getPhoneNumber();
        dto.addressLine = shop.getAddressLine();
        dto.city = shop.getCity();
        dto.state = shop.getState();
        dto.postalCode = shop.getPostalCode();
        dto.latitude = shop.getLatitude();
        dto.longitude = shop.getLongitude();
        dto.bannerImageUrl = shop.getBannerImageUrl();
        dto.profileImageUrl = shop.getProfileImageUrl();
        dto.verificationStatus = shop.getVerificationStatus();
        dto.temporarilyClosed = shop.isTemporarilyClosed();
        dto.closureReason = shop.getClosureReason();
        dto.statusInfo = statusInfo;
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getDescription() {
        return description;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public boolean isTemporarilyClosed() {
        return temporarilyClosed;
    }

    public String getClosureReason() {
        return closureReason;
    }

    public ShopStatusDto getStatusInfo() {
        return statusInfo;
    }

    public void setStatusInfo(ShopStatusDto statusInfo) {
        this.statusInfo = statusInfo;
    }
}
