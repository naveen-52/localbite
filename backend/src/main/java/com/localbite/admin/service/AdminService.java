package com.localbite.admin.service;

import com.localbite.admin.dto.PlatformStatsDto;
import com.localbite.admin.entity.AdminAuditLog;
import com.localbite.admin.repository.AdminAuditLogRepository;
import com.localbite.common.exception.ResourceNotFoundException;
import com.localbite.payment.entity.PaymentStatus;
import com.localbite.payment.entity.PaymentTransaction;
import com.localbite.payment.entity.SubscriptionPlan;
import com.localbite.payment.repository.PaymentTransactionRepository;
import com.localbite.payment.repository.SubscriptionPlanRepository;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.VerificationStatus;
import com.localbite.shop.repository.ShopRepository;
import com.localbite.user.entity.Role;
import com.localbite.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final AdminAuditLogRepository auditLogRepository;

    public AdminService(
            UserRepository userRepository,
            ShopRepository shopRepository,
            PaymentTransactionRepository transactionRepository,
            SubscriptionPlanRepository planRepository,
            AdminAuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.transactionRepository = transactionRepository;
        this.planRepository = planRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public PlatformStatsDto getPlatformStats() {
        long customers = userRepository.countByRole(Role.CUSTOMER);
        long shopOwners = userRepository.countByRole(Role.SHOP_OWNER);
        long activeShops = shopRepository.countByVerificationStatus(VerificationStatus.APPROVED);
        long pendingShops = shopRepository.countByVerificationStatus(VerificationStatus.PENDING);
        long suspendedShops = shopRepository.countByVerificationStatus(VerificationStatus.SUSPENDED);

        List<PaymentTransaction> successfulTransactions = transactionRepository.findByStatus(PaymentStatus.SUCCESS);
        BigDecimal totalRevenue = successfulTransactions.stream()
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PlatformStatsDto(customers, shopOwners, activeShops, pendingShops, suspendedShops, totalRevenue);
    }

    @Transactional
    public Shop verifyShop(Long shopId, VerificationStatus newStatus, Long adminId, String ipAddress) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", shopId));

        VerificationStatus previousStatus = shop.getVerificationStatus();
        shop.setVerificationStatus(newStatus);
        Shop savedShop = shopRepository.save(shop);

        AdminAuditLog audit = new AdminAuditLog(
                adminId,
                "VERIFY_SHOP",
                "SHOP",
                shop.getId(),
                "{\"status\":\"" + previousStatus + "\"}",
                "{\"status\":\"" + newStatus + "\"}",
                ipAddress
        );
        auditLogRepository.save(audit);

        log.info("Admin id={} changed shop id={} status: {} -> {}", adminId, shopId, previousStatus, newStatus);
        return savedShop;
    }

    @Transactional
    public SubscriptionPlan updatePlanPrice(Long planId, BigDecimal newPrice, Long adminId, String ipAddress) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("SubscriptionPlan", "id", planId));

        BigDecimal previousPrice = plan.getPrice();
        plan.setPrice(newPrice);
        SubscriptionPlan saved = planRepository.save(plan);

        AdminAuditLog audit = new AdminAuditLog(
                adminId,
                "UPDATE_PLAN_PRICE",
                "SUBSCRIPTION_PLAN",
                plan.getId(),
                "{\"price\":" + previousPrice + "}",
                "{\"price\":" + newPrice + "}",
                ipAddress
        );
        auditLogRepository.save(audit);

        log.info("Admin id={} updated plan id={} price: ₹{} -> ₹{}", adminId, planId, previousPrice, newPrice);
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<AdminAuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Shop> getPendingShops(Pageable pageable) {
        return shopRepository.findByVerificationStatus(VerificationStatus.PENDING, pageable);
    }
}
