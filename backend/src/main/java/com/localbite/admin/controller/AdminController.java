package com.localbite.admin.controller;

import com.localbite.admin.dto.PlatformStatsDto;
import com.localbite.admin.entity.AdminAuditLog;
import com.localbite.admin.service.AdminService;
import com.localbite.common.dto.ApiResponse;
import com.localbite.common.security.UserPrincipal;
import com.localbite.payment.entity.SubscriptionPlan;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.VerificationStatus;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PlatformStatsDto>> getPlatformStats() {
        PlatformStatsDto stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Platform analytics retrieved successfully"));
    }

    @GetMapping("/shops/pending")
    public ResponseEntity<ApiResponse<Page<Shop>>> getPendingShops(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Shop> shops = adminService.getPendingShops(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(shops, "Pending shop registrations retrieved successfully"));
    }

    @PatchMapping("/shops/{shopId}/verify")
    public ResponseEntity<ApiResponse<Shop>> verifyShop(
            @PathVariable Long shopId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal admin,
            HttpServletRequest request) {
        VerificationStatus status = VerificationStatus.valueOf(payload.get("status").toUpperCase());
        Shop updated = adminService.verifyShop(shopId, status, admin.getId(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success(updated, "Shop verification status updated to " + status));
    }

    @PutMapping("/plans/{planId}/price")
    public ResponseEntity<ApiResponse<SubscriptionPlan>> updatePlanPrice(
            @PathVariable Long planId,
            @RequestBody Map<String, BigDecimal> payload,
            @AuthenticationPrincipal UserPrincipal admin,
            HttpServletRequest request) {
        BigDecimal newPrice = payload.get("price");
        SubscriptionPlan updated = adminService.updatePlanPrice(planId, newPrice, admin.getId(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success(updated, "Subscription plan pricing updated successfully"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AdminAuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AdminAuditLog> logs = adminService.getAuditLogs(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(logs, "System audit logs retrieved successfully"));
    }
}
