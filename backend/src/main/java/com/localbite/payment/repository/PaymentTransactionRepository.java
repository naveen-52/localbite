package com.localbite.payment.repository;

import com.localbite.payment.entity.PaymentStatus;
import com.localbite.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTransactionRef(String transactionRef);
    Optional<PaymentTransaction> findByGatewayOrderId(String gatewayOrderId);
    Optional<PaymentTransaction> findByGatewayPaymentId(String gatewayPaymentId);
    List<PaymentTransaction> findByShopIdOrderByCreatedAtDesc(Long shopId);
    List<PaymentTransaction> findByStatus(PaymentStatus status);
}
