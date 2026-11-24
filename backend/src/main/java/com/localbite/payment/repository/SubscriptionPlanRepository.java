package com.localbite.payment.repository;

import com.localbite.payment.entity.PlanType;
import com.localbite.payment.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByActiveTrueOrderByPriceAsc();
    List<SubscriptionPlan> findByPlanTypeAndActiveTrue(PlanType planType);
}
