package com.localbite.common;

import com.localbite.food.entity.AvailabilityStatus;
import com.localbite.food.entity.FoodCategory;
import com.localbite.food.entity.FoodItem;
import com.localbite.food.repository.FoodCategoryRepository;
import com.localbite.food.repository.FoodItemRepository;
import com.localbite.payment.entity.BillingInterval;
import com.localbite.payment.entity.PlanType;
import com.localbite.payment.entity.SubscriptionPlan;
import com.localbite.payment.repository.SubscriptionPlanRepository;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.ShopBusinessHours;
import com.localbite.shop.entity.ShopCategory;
import com.localbite.shop.entity.VerificationStatus;
import com.localbite.shop.repository.ShopBusinessHoursRepository;
import com.localbite.shop.repository.ShopCategoryRepository;
import com.localbite.shop.repository.ShopRepository;
import com.localbite.user.entity.Role;
import com.localbite.user.entity.User;
import com.localbite.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ShopCategoryRepository categoryRepository;
    private final SubscriptionPlanRepository planRepository;
    private final ShopRepository shopRepository;
    private final ShopBusinessHoursRepository hoursRepository;
    private final FoodCategoryRepository foodCategoryRepository;
    private final FoodItemRepository foodItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ShopCategoryRepository categoryRepository,
            SubscriptionPlanRepository planRepository,
            ShopRepository shopRepository,
            ShopBusinessHoursRepository hoursRepository,
            FoodCategoryRepository foodCategoryRepository,
            FoodItemRepository foodItemRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.planRepository = planRepository;
        this.shopRepository = shopRepository;
        this.hoursRepository = hoursRepository;
        this.foodCategoryRepository = foodCategoryRepository;
        this.foodItemRepository = foodItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        ensureAllCategoriesExist();
        ensurePlansExist();
        ensureAdminExists();

        // Remove any legacy demo shops from the database
        removeDemoDataIfPresent();

        // Auto-approve any registered stalls in development
        shopRepository.findAll().forEach(s -> {
            boolean changed = false;
            if (s.getVerificationStatus() == VerificationStatus.PENDING) {
                s.setVerificationStatus(VerificationStatus.APPROVED);
                changed = true;
                log.info("Auto-approved stall: {} ({})", s.getName(), s.getCity());
            }
            if (changed) {
                shopRepository.save(s);
            }
        });

        log.info("Platform ready. All demo data removed.");
    }

    private void removeDemoDataIfPresent() {
        String[] demoSlugs = new String[]{"kumar-mini-tiffin-shop", "sharmaji-cutting-chai-samosa"};
        for (String slug : demoSlugs) {
            shopRepository.findBySlug(slug).ifPresent(s -> {
                foodItemRepository.deleteAll(foodItemRepository.findByShopId(s.getId()));
                hoursRepository.deleteByShopId(s.getId());
                shopRepository.delete(s);
                userRepository.findById(s.getOwnerId()).ifPresent(userRepository::delete);
                log.info("Removed demo shop: {} ({})", s.getName(), slug);
            });
        }
        userRepository.findByEmail("kumar@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("sharma@example.com").ifPresent(userRepository::delete);
    }

    private void ensureAdminExists() {
        if (userRepository.findByEmail("admin@localbite.com").isEmpty()) {
            User admin = User.builder()
                    .fullName("LocalBite Super Admin")
                    .email("admin@localbite.com")
                    .phoneNumber("+919876543210")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded super admin: admin@localbite.com");
        }
    }

    private void ensurePlansExist() {
        if (planRepository.count() == 0) {
            planRepository.save(new SubscriptionPlan(null, "One-Time Shop Registration Fee", PlanType.REGISTRATION_FEE, BillingInterval.ONE_TIME, 3650, BigDecimal.valueOf(199.00), "Standard onboarding and physical verification fee for stall owners", true));
            planRepository.save(new SubscriptionPlan(null, "Monthly Stall Visibility Plan", PlanType.RECURRING_SUBSCRIPTION, BillingInterval.MONTHLY, 30, BigDecimal.valueOf(99.00), "Keep stall active on live customer map with sub-500ms real-time availability updates", true));
            planRepository.save(new SubscriptionPlan(null, "Quarterly Saver Plan", PlanType.RECURRING_SUBSCRIPTION, BillingInterval.QUARTERLY, 90, BigDecimal.valueOf(249.00), "3-month continuous live broadcast with priority discovery placement", true));
            planRepository.save(new SubscriptionPlan(null, "Annual Pro Merchant Plan", PlanType.RECURRING_SUBSCRIPTION, BillingInterval.YEARLY, 365, BigDecimal.valueOf(899.00), "Full year listing, verified badge, and analytics access", true));
            log.info("Seeded subscription plans");
        }
    }

    private void ensureAllCategoriesExist() {
        createCategoryIfMissing("Tea & Coffee Stall", "tea-coffee-stall", "Coffee", 1);
        createCategoryIfMissing("Tiffin & Breakfast", "tiffin-breakfast", "Utensils", 2);
        createCategoryIfMissing("Fresh Juices & Shakes", "fresh-juices-shakes", "Citrus", 3);
        createCategoryIfMissing("Kulfi & Ice Creams", "kulfi-ice-creams", "IceCream", 4);
        createCategoryIfMissing("Chaat & Street Snacks", "chaat-street-snacks", "Sparkles", 5);
        createCategoryIfMissing("Evening Snacks (Bajji, Vada)", "evening-snacks", "Flame", 6);
        createCategoryIfMissing("Street Biryani & Parotta", "biryani-parotta", "Drumstick", 7);
        createCategoryIfMissing("Fast Food & Sandwiches", "fast-food-sandwiches", "Sandwich", 8);
        createCategoryIfMissing("Sweet & Savory Bakery", "sweet-savory-bakery", "Cake", 9);
        createCategoryIfMissing("Tender Coconut & Fruits", "coconut-fresh-fruits", "Apple", 10);
        createCategoryIfMissing("Soup & Herbal Drinks", "soup-herbal", "Soup", 11);
        createCategoryIfMissing("Paan & Refreshments", "paan-refreshments", "Leaf", 12);
    }

    private void createCategoryIfMissing(String name, String slug, String icon, int order) {
        if (categoryRepository.findBySlug(slug).isEmpty()) {
            categoryRepository.save(new ShopCategory(null, name, slug, icon, order, true));
            log.info("Seeded mini eatery category: {} ({})", name, slug);
        }
    }
}
