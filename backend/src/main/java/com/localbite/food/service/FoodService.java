package com.localbite.food.service;

import com.localbite.common.exception.BadRequestException;
import com.localbite.common.exception.ResourceNotFoundException;
import com.localbite.common.exception.UnauthorizedException;
import com.localbite.food.dto.AvailabilityEventDto;
import com.localbite.food.dto.CreateFoodRequest;
import com.localbite.food.dto.FoodItemDto;
import com.localbite.food.dto.UpdateAvailabilityRequest;
import com.localbite.food.entity.AvailabilityStatus;
import com.localbite.food.entity.FoodAvailabilityHistory;
import com.localbite.food.entity.FoodCategory;
import com.localbite.food.entity.FoodItem;
import com.localbite.food.repository.FoodAvailabilityHistoryRepository;
import com.localbite.food.repository.FoodCategoryRepository;
import com.localbite.food.repository.FoodItemRepository;
import com.localbite.realtime.service.AvailabilityBroadcastService;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.repository.ShopRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private static final Logger log = LoggerFactory.getLogger(FoodService.class);

    private final FoodItemRepository foodItemRepository;
    private final FoodCategoryRepository categoryRepository;
    private final FoodAvailabilityHistoryRepository historyRepository;
    private final ShopRepository shopRepository;
    private final AvailabilityBroadcastService broadcastService;

    public FoodService(
            FoodItemRepository foodItemRepository,
            FoodCategoryRepository categoryRepository,
            FoodAvailabilityHistoryRepository historyRepository,
            ShopRepository shopRepository,
            AvailabilityBroadcastService broadcastService) {
        this.foodItemRepository = foodItemRepository;
        this.categoryRepository = categoryRepository;
        this.historyRepository = historyRepository;
        this.shopRepository = shopRepository;
        this.broadcastService = broadcastService;
    }

    @Transactional
    public FoodItemDto addFoodItem(Long shopId, CreateFoodRequest request, Long ownerUserId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", shopId));

        if (!shop.getOwnerId().equals(ownerUserId)) {
            throw new UnauthorizedException("You do not have permission to add food items to this shop.");
        }

        FoodCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        FoodItem item = FoodItem.builder()
                .shopId(shop.getId())
                .category(category)
                .name(request.getName().trim())
                .regionalName(request.getRegionalName() != null ? request.getRegionalName().trim() : null)
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .availabilityStatus(request.getAvailabilityStatus())
                .quantityTracked(request.isQuantityTracked())
                .currentQuantity(request.getCurrentQuantity())
                .enabled(true)
                .build();

        FoodItem saved = foodItemRepository.save(item);
        log.info("Added new food item id={} name={} to shop id={}", saved.getId(), saved.getName(), shop.getId());
        return FoodItemDto.fromEntity(saved);
    }

    @Transactional
    public FoodItemDto updateAvailability(Long foodItemId, UpdateAvailabilityRequest request, Long currentUserId) {
        FoodItem item = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", "id", foodItemId));

        Shop shop = shopRepository.findById(item.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", item.getShopId()));

        if (!shop.getOwnerId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to modify inventory for this shop.");
        }

        String previousStatus = item.getAvailabilityStatus().name();
        Integer previousQuantity = item.getCurrentQuantity();

        AvailabilityStatus newStatus = request.getStatus();

        if (request.getQuantity() != null) {
            item.setCurrentQuantity(Math.max(0, request.getQuantity()));
            if (item.isQuantityTracked() && item.getCurrentQuantity() == 0) {
                newStatus = AvailabilityStatus.SOLD_OUT;
            }
        }

        item.setAvailabilityStatus(newStatus);
        FoodItem updated = foodItemRepository.save(item);

        // 1. Record in persistent history table
        FoodAvailabilityHistory history = new FoodAvailabilityHistory(
                item.getId(),
                previousStatus,
                newStatus.name(),
                previousQuantity,
                item.getCurrentQuantity(),
                currentUserId
        );
        historyRepository.save(history);

        // 2. Broadcast live event to WebSocket topic (/topic/shop/{shopId}/availability)
        AvailabilityEventDto event = new AvailabilityEventDto(
                item.getId(),
                shop.getId(),
                item.getName(),
                newStatus,
                item.isQuantityTracked() ? item.getCurrentQuantity() : null,
                Instant.now()
        );
        broadcastService.broadcastAvailabilityChange(event);

        log.info("Updated availability for item id={}: {} -> {}", item.getId(), previousStatus, newStatus);
        return FoodItemDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<FoodItemDto> getShopMenu(Long shopId) {
        return foodItemRepository.findByShopIdAndEnabledTrue(shopId).stream()
                .map(FoodItemDto::fromEntity)
                .collect(Collectors.toList());
    }
}
