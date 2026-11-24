package com.localbite.payment.service;

import com.localbite.common.exception.BadRequestException;
import com.localbite.common.exception.ResourceNotFoundException;
import com.localbite.common.exception.UnauthorizedException;
import com.localbite.payment.dto.CreateOrderRequest;
import com.localbite.payment.dto.OrderResponseDto;
import com.localbite.payment.dto.VerifyPaymentRequest;
import com.localbite.payment.entity.*;
import com.localbite.payment.repository.PaymentTransactionRepository;
import com.localbite.payment.repository.PaymentWebhookEventRepository;
import com.localbite.payment.repository.SubscriptionPlanRepository;
import com.localbite.payment.repository.SubscriptionRepository;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.repository.ShopRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final PaymentWebhookEventRepository webhookEventRepository;
    private final ShopRepository shopRepository;

    private final String razorpayKeyId;
    private final String razorpayKeySecret;
    private final String webhookSecret;

    public PaymentService(
            SubscriptionPlanRepository planRepository,
            SubscriptionRepository subscriptionRepository,
            PaymentTransactionRepository transactionRepository,
            PaymentWebhookEventRepository webhookEventRepository,
            ShopRepository shopRepository,
            @Value("${app.razorpay.key-id}") String razorpayKeyId,
            @Value("${app.razorpay.key-secret}") String razorpayKeySecret,
            @Value("${app.razorpay.webhook-secret}") String webhookSecret) {
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.transactionRepository = transactionRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.shopRepository = shopRepository;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
        this.webhookSecret = webhookSecret;
    }

    @Transactional
    public OrderResponseDto createPaymentOrder(CreateOrderRequest request, Long userId) {
        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", request.getShopId()));

        if (!shop.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("You are not the owner of this shop.");
        }

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("SubscriptionPlan", "id", request.getPlanId()));

        if (!plan.isActive()) {
            throw new BadRequestException("The selected subscription plan is no longer active.");
        }

        String transactionRef = "TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        String gatewayOrderId;

        try {
            // Amount in paise (1 INR = 100 paise)
            long amountInPaise = plan.getPrice().multiply(BigDecimal.valueOf(100)).longValue();

            if (!razorpayKeyId.contains("placeholder")) {
                RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", transactionRef);

                Order razorpayOrder = client.orders.create(orderRequest);
                gatewayOrderId = razorpayOrder.get("id");
            } else {
                // Deterministic sandbox mock order ID for development
                gatewayOrderId = "order_mock_" + System.currentTimeMillis();
            }
        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage(), e);
            throw new BadRequestException("Failed to initiate payment gateway order: " + e.getMessage());
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .transactionRef(transactionRef)
                .shopId(shop.getId())
                .userId(userId)
                .plan(plan)
                .gatewayOrderId(gatewayOrderId)
                .amount(plan.getPrice())
                .currency("INR")
                .status(PaymentStatus.PENDING)
                .build();

        transactionRepository.save(transaction);
        log.info("Created payment order transactionRef={} gatewayOrderId={} amount={}", transactionRef, gatewayOrderId, plan.getPrice());

        return new OrderResponseDto(
                transactionRef,
                gatewayOrderId,
                razorpayKeyId,
                plan.getPrice(),
                "INR",
                plan.getTitle(),
                shop.getName()
        );
    }

    @Transactional
    public boolean verifyPayment(VerifyPaymentRequest request, Long userId) {
        PaymentTransaction transaction = transactionRepository.findByGatewayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found for order: " + request.getRazorpayOrderId()));

        if (!transaction.getUserId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized access to payment transaction.");
        }

        // If in mock sandbox mode, accept valid mock prefix
        boolean signatureValid;
        if (request.getRazorpayOrderId().startsWith("order_mock_")) {
            signatureValid = true;
        } else {
            String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            signatureValid = verifyHmacSha256(data, request.getRazorpaySignature(), razorpayKeySecret);
        }

        if (!signatureValid) {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setFailureReason("Cryptographic signature verification failed");
            transactionRepository.save(transaction);
            throw new BadRequestException("Payment signature verification failed. Potential tampering detected.");
        }

        // Update transaction
        transaction.setGatewayPaymentId(request.getRazorpayPaymentId());
        transaction.setGatewaySignature(request.getRazorpaySignature());
        transaction.setStatus(PaymentStatus.SUCCESS);
        transactionRepository.save(transaction);

        // Activate or Extend Subscription
        activateSubscription(transaction.getShopId(), transaction.getPlan());
        log.info("Payment verified successfully for shopId={} orderId={}", transaction.getShopId(), request.getRazorpayOrderId());
        return true;
    }

    @Transactional
    public void activateSubscription(Long shopId, SubscriptionPlan plan) {
        Instant now = Instant.now();
        Instant endDate = now.plus(Duration.ofDays(plan.getDurationDays()));
        Instant gracePeriodEndDate = endDate.plus(Duration.ofHours(48)); // 48-Hour Grace Period

        Subscription subscription = new Subscription(
                null,
                shopId,
                plan,
                SubscriptionStatus.ACTIVE,
                now,
                endDate,
                gracePeriodEndDate,
                false
        );
        subscriptionRepository.save(subscription);
        log.info("Activated subscription id={} shopId={} plan={} validUntil={}", subscription.getId(), shopId, plan.getTitle(), endDate);
    }

    private boolean verifyHmacSha256(String data, String receivedSignature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return MessageDigest.isEqual(hexString.toString().getBytes(StandardCharsets.UTF_8),
                    receivedSignature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Error computing HMAC-SHA256: {}", e.getMessage());
            return false;
        }
    }
}
