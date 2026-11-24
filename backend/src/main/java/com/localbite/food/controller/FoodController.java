package com.localbite.food.controller;

import com.localbite.common.dto.ApiResponse;
import com.localbite.common.security.UserPrincipal;
import com.localbite.food.dto.CreateFoodRequest;
import com.localbite.food.dto.FoodItemDto;
import com.localbite.food.dto.UpdateAvailabilityRequest;
import com.localbite.food.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping("/shops/{shopId}/menu")
    public ResponseEntity<ApiResponse<List<FoodItemDto>>> getShopMenu(@PathVariable Long shopId) {
        List<FoodItemDto> menu = foodService.getShopMenu(shopId);
        return ResponseEntity.ok(ApiResponse.success(menu, "Shop menu retrieved successfully"));
    }

    @PostMapping("/shops/{shopId}/foods")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<FoodItemDto>> addFoodItem(
            @PathVariable Long shopId,
            @Valid @RequestBody CreateFoodRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FoodItemDto created = foodService.addFoodItem(shopId, request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Food item added successfully"));
    }

    @PatchMapping("/foods/{foodItemId}/availability")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<FoodItemDto>> updateAvailability(
            @PathVariable Long foodItemId,
            @Valid @RequestBody UpdateAvailabilityRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FoodItemDto updated = foodService.updateAvailability(foodItemId, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(updated, "Availability updated successfully"));
    }
}
