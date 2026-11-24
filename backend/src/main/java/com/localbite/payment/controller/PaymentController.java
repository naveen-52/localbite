package com.localbite.payment.controller;

import com.localbite.common.dto.ApiResponse;
import com.localbite.common.security.UserPrincipal;
import com.localbite.payment.dto.CreateOrderRequest;
import com.localbite.payment.dto.OrderResponseDto;
import com.localbite.payment.dto.VerifyPaymentRequest;
import com.localbite.payment.entity.PaymentTransaction;
import com.localbite.payment.entity.SubscriptionPlan;
import com.localbite.payment.repository.PaymentTransactionRepository;
import com.localbite.payment.repository.SubscriptionPlanRepository;
import com.localbite.payment.service.PaymentService;
import com.localbite.shop.dto.ShopDetailDto;
import com.localbite.shop.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class PaymentController {

    private final PaymentService paymentService;
    private final SubscriptionPlanRepository planRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final ShopService shopService;

    public PaymentController(
            PaymentService paymentService,
            SubscriptionPlanRepository planRepository,
            PaymentTransactionRepository transactionRepository,
            ShopService shopService) {
        this.paymentService = paymentService;
        this.planRepository = planRepository;
        this.transactionRepository = transactionRepository;
        this.shopService = shopService;
    }

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<SubscriptionPlan>>> getActivePlans() {
        List<SubscriptionPlan> plans = planRepository.findByActiveTrueOrderByPriceAsc();
        return ResponseEntity.ok(ApiResponse.success(plans, "Subscription plans retrieved successfully"));
    }

    @PostMapping("/payments/create-order")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        OrderResponseDto order = paymentService.createPaymentOrder(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(order, "Payment order created successfully"));
    }

    @PostMapping("/payments/verify")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean verified = paymentService.verifyPayment(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(verified, "Payment verified and subscription activated successfully"));
    }

    @GetMapping("/payments/history")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<List<PaymentTransaction>>> getPaymentHistory(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ShopDetailDto myShop = shopService.getShopByOwnerId(currentUser.getId());
        List<PaymentTransaction> transactions = transactionRepository.findByShopIdOrderByCreatedAtDesc(myShop.getId());
        return ResponseEntity.ok(ApiResponse.success(transactions, "Payment history retrieved successfully"));
    }
}
