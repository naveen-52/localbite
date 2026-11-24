package com.localbite.payment.repository;

import com.localbite.payment.entity.Subscription;
import com.localbite.payment.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findTopByShopIdAndStatusInOrderByEndDateDesc(Long shopId, List<SubscriptionStatus> statuses);
    List<Subscription> findByShopIdOrderByCreatedAtDesc(Long shopId);
    boolean existsByShopIdAndStatus(Long shopId, SubscriptionStatus status);
}
