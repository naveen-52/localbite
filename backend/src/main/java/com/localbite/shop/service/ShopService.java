package com.localbite.shop.service;

import com.localbite.common.exception.BadRequestException;
import com.localbite.common.exception.ResourceNotFoundException;
import com.localbite.common.exception.UnauthorizedException;
import com.localbite.food.entity.AvailabilityStatus;
import com.localbite.food.repository.FoodItemRepository;
import com.localbite.shop.dto.CreateShopRequest;
import com.localbite.shop.dto.NearbyShopDto;
import com.localbite.shop.dto.ShopDetailDto;
import com.localbite.shop.dto.ShopStatusDto;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.ShopBusinessHours;
import com.localbite.shop.entity.ShopCategory;
import com.localbite.shop.entity.VerificationStatus;
import com.localbite.shop.repository.ShopBusinessHoursRepository;
import com.localbite.shop.repository.ShopCategoryRepository;
import com.localbite.shop.repository.ShopRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ShopService {

    private static final Logger log = LoggerFactory.getLogger(ShopService.class);

    private final ShopRepository shopRepository;
    private final ShopCategoryRepository categoryRepository;
    private final ShopBusinessHoursRepository businessHoursRepository;
    private final FoodItemRepository foodItemRepository;
    private final ShopTimingService timingService;

    public ShopService(
            ShopRepository shopRepository,
            ShopCategoryRepository categoryRepository,
            ShopBusinessHoursRepository businessHoursRepository,
            FoodItemRepository foodItemRepository,
            ShopTimingService timingService) {
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
        this.businessHoursRepository = businessHoursRepository;
        this.foodItemRepository = foodItemRepository;
        this.timingService = timingService;
    }

    @Transactional
    public ShopDetailDto createShop(CreateShopRequest request, Long ownerId) {
        if (shopRepository.existsByOwnerId(ownerId)) {
            throw new BadRequestException("You have already registered a shop with this account.");
        }

        ShopCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ShopCategory", "id", request.getCategoryId()));

        String slug = generateUniqueSlug(request.getName());

        Shop shop = Shop.builder()
                .ownerId(ownerId)
                .category(category)
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .phoneNumber(request.getPhoneNumber().trim())
                .addressLine(request.getAddressLine().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .postalCode(request.getPostalCode().trim())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .bannerImageUrl(request.getBannerImageUrl())
                .profileImageUrl(request.getProfileImageUrl())
                .verificationStatus(VerificationStatus.APPROVED)
                .temporarilyClosed(false)
                .build();

        Shop savedShop = shopRepository.save(shop);

        // Seed default business hours: 7:00 AM to 10:00 PM every day
        for (int day = 1; day <= 7; day++) {
            ShopBusinessHours hours = new ShopBusinessHours(
                    null,
                    savedShop.getId(),
                    day,
                    LocalTime.of(7, 0),
                    LocalTime.of(22, 0),
                    false
            );
            businessHoursRepository.save(hours);
        }

        log.info("Registered new shop id={} name={} slug={} ownerId={}", savedShop.getId(), savedShop.getName(), savedShop.getSlug(), ownerId);
        ShopStatusDto status = timingService.computeShopStatus(savedShop);
        return ShopDetailDto.fromEntity(savedShop, status);
    }

    @Transactional
    public ShopDetailDto updateShop(Long shopId, CreateShopRequest request, Long ownerId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", shopId));

        if (!shop.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to update this shop.");
        }

        if (request.getCategoryId() != null) {
            ShopCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("ShopCategory", "id", request.getCategoryId()));
            shop.setCategory(category);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            shop.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            shop.setDescription(request.getDescription().trim());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            shop.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAddressLine() != null && !request.getAddressLine().isBlank()) {
            shop.setAddressLine(request.getAddressLine().trim());
        }
        if (request.getCity() != null && !request.getCity().isBlank()) {
            shop.setCity(request.getCity().trim());
        }
        if (request.getState() != null && !request.getState().isBlank()) {
            shop.setState(request.getState().trim());
        }
        if (request.getPostalCode() != null && !request.getPostalCode().isBlank()) {
            shop.setPostalCode(request.getPostalCode().trim());
        }
        if (request.getLatitude() != null) {
            shop.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            shop.setLongitude(request.getLongitude());
        }
        if (request.getBannerImageUrl() != null) {
            shop.setBannerImageUrl(request.getBannerImageUrl());
        }
        if (request.getProfileImageUrl() != null) {
            shop.setProfileImageUrl(request.getProfileImageUrl());
        }

        Shop saved = shopRepository.save(shop);
        ShopStatusDto status = timingService.computeShopStatus(saved);
        log.info("Updated shop id={} name={} category={}", saved.getId(), saved.getName(), saved.getCategory().getName());
        return ShopDetailDto.fromEntity(saved, status);
    }

    @Transactional(readOnly = true)
    public ShopDetailDto getShopBySlug(String slug) {
        Shop shop;
        if (slug != null && slug.matches("^\\d+$")) {
            long id = Long.parseLong(slug);
            shop = shopRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", id));
        } else {
            shop = shopRepository.findBySlug(slug)
                    .orElseThrow(() -> new ResourceNotFoundException("Shop", "slug", slug));
        }

        ShopStatusDto status = timingService.computeShopStatus(shop);
        return ShopDetailDto.fromEntity(shop, status);
    }

    @Transactional(readOnly = true)
    public ShopDetailDto getShopByOwnerId(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for the current owner."));

        ShopStatusDto status = timingService.computeShopStatus(shop);
        return ShopDetailDto.fromEntity(shop, status);
    }

    @Transactional(readOnly = true)
    public List<NearbyShopDto> getNearbyShops(double userLat, double userLng, double radiusKm) {
        List<Shop> shops = shopRepository.findNearbyShops(userLat, userLng, radiusKm);
        List<NearbyShopDto> result = new ArrayList<>();

        for (Shop shop : shops) {
            double distance = calculateDistanceKm(userLat, userLng, shop.getLatitude().doubleValue(), shop.getLongitude().doubleValue());
            ShopStatusDto status = timingService.computeShopStatus(shop);
            int availableCount = foodItemRepository.findByShopIdAndAvailabilityStatusAndEnabledTrue(
                    shop.getId(), AvailabilityStatus.AVAILABLE
            ).size();

            result.add(new NearbyShopDto(
                    shop.getId(),
                    shop.getName(),
                    shop.getSlug(),
                    shop.getCategory().getName(),
                    shop.getAddressLine(),
                    shop.getLatitude(),
                    shop.getLongitude(),
                    shop.getProfileImageUrl(),
                    shop.getBannerImageUrl(),
                    distance,
                    status.isOpen(),
                    status.getStatusMessage(),
                    availableCount
            ));
        }

        return result;
    }

    @Transactional
    public ShopDetailDto toggleTemporaryClosure(Long shopId, boolean closed, String reason, Long currentUserId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", shopId));

        if (!shop.getOwnerId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not own this shop.");
        }

        shop.setTemporarilyClosed(closed);
        shop.setClosureReason(closed ? reason : null);

        Shop saved = shopRepository.save(shop);
        ShopStatusDto status = timingService.computeShopStatus(saved);
        return ShopDetailDto.fromEntity(saved, status);
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
        if (base.isEmpty()) {
            base = "shop";
        }
        String candidate = base;
        int counter = 1;
        while (shopRepository.existsBySlug(candidate)) {
            candidate = base + "-" + counter++;
        }
        return candidate;
    }

    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
