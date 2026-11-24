package com.localbite.shop.controller;

import com.localbite.common.dto.ApiResponse;
import com.localbite.common.security.UserPrincipal;
import com.localbite.shop.dto.CreateShopRequest;
import com.localbite.shop.dto.NearbyShopDto;
import com.localbite.shop.dto.ShopDetailDto;
import com.localbite.shop.entity.ShopCategory;
import com.localbite.shop.repository.ShopCategoryRepository;
import com.localbite.shop.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class ShopController {

    private final ShopService shopService;
    private final ShopCategoryRepository categoryRepository;

    public ShopController(ShopService shopService, ShopCategoryRepository categoryRepository) {
        this.shopService = shopService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<ShopCategory>>> getActiveCategories() {
        List<ShopCategory> categories = categoryRepository.findByActiveTrueOrderByDisplayOrderAsc();
        return ResponseEntity.ok(ApiResponse.success(categories, "Categories retrieved successfully"));
    }

    @GetMapping("/shops/nearby")
    public ResponseEntity<ApiResponse<List<NearbyShopDto>>> getNearbyShops(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5.0") double radius) {
        List<NearbyShopDto> nearbyShops = shopService.getNearbyShops(lat, lng, radius);
        return ResponseEntity.ok(ApiResponse.success(nearbyShops, "Nearby shops retrieved successfully"));
    }

    @GetMapping("/shops/{slug}")
    public ResponseEntity<ApiResponse<ShopDetailDto>> getShopDetails(@PathVariable String slug) {
        ShopDetailDto shop = shopService.getShopBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(shop, "Shop details retrieved successfully"));
    }

    @PostMapping("/shops")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<ShopDetailDto>> createShop(
            @Valid @RequestBody CreateShopRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ShopDetailDto created = shopService.createShop(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Shop registered successfully and queued for verification"));
    }

    @GetMapping("/owner/my-shop")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<ShopDetailDto>> getMyShop(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ShopDetailDto shop = shopService.getShopByOwnerId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(shop, "Owner shop retrieved successfully"));
    }

    @PutMapping("/owner/my-shop")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<ShopDetailDto>> updateMyShop(
            @Valid @RequestBody CreateShopRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ShopDetailDto myShop = shopService.getShopByOwnerId(currentUser.getId());
        ShopDetailDto updated = shopService.updateShop(myShop.getId(), request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(updated, "Shop details updated successfully"));
    }

    @PatchMapping("/owner/my-shop/closure")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<ShopDetailDto>> toggleTemporaryClosure(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean closed = Boolean.TRUE.equals(payload.get("closed"));
        String reason = (String) payload.get("reason");
        ShopDetailDto myShop = shopService.getShopByOwnerId(currentUser.getId());
        ShopDetailDto updated = shopService.toggleTemporaryClosure(myShop.getId(), closed, reason, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(updated, "Shop closure status updated successfully"));
    }
}
