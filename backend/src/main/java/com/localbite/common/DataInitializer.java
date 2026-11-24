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

        if (userRepository.count() > 0) {
            log.info("Database already seeded. Ensuring all categories exist.");
            // Auto-approve any pending stalls in development so they immediately appear on customer map
            shopRepository.findAll().forEach(s -> {
                boolean changed = false;
                if (s.getVerificationStatus() == VerificationStatus.PENDING) {
                    s.setVerificationStatus(VerificationStatus.APPROVED);
                    changed = true;
                    log.info("Auto-approved stall: {} ({})", s.getName(), s.getCity());
                }
                if (s.getBannerImageUrl() == null || s.getBannerImageUrl().isBlank()) {
                    String name = s.getName().toLowerCase();
                    if (name.contains("kulfi") || name.contains("ice")) {
                        s.setBannerImageUrl("https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80");
                    } else if (name.contains("juice") || name.contains("shake")) {
                        s.setBannerImageUrl("https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80");
                    } else if (name.contains("tea") || name.contains("chai") || name.contains("coffee")) {
                        s.setBannerImageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80");
                    } else {
                        s.setBannerImageUrl("https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80");
                    }
                    changed = true;
                    log.info("Assigned default banner to stall: {}", s.getName());
                }
                if (changed) {
                    shopRepository.save(s);
                }
            });
            return;
        }

        log.info("Populating initial LocalBite platform seed data...");

        // 1. Seed Super Admin
        User admin = User.builder()
                .fullName("LocalBite Super Admin")
                .email("admin@localbite.com")
                .phoneNumber("+919876543210")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        // 2. Fetch seeded categories
        ShopCategory teaCat = categoryRepository.findBySlug("tea-coffee-stall").orElse(null);
        ShopCategory tiffinCat = categoryRepository.findBySlug("tiffin-breakfast").orElse(null);

        // 3. Seed Subscription Plans
        planRepository.save(new SubscriptionPlan(null, "One-Time Shop Registration Fee", PlanType.REGISTRATION_FEE, BillingInterval.ONE_TIME, 3650, BigDecimal.valueOf(199.00), "Standard onboarding and physical verification fee for stall owners", true));
        planRepository.save(new SubscriptionPlan(null, "Monthly Stall Visibility Plan", PlanType.RECURRING_SUBSCRIPTION, BillingInterval.MONTHLY, 30, BigDecimal.valueOf(99.00), "Keep stall active on live customer map with sub-500ms real-time availability updates", true));
        planRepository.save(new SubscriptionPlan(null, "Quarterly Saver Plan", PlanType.RECURRING_SUBSCRIPTION, BillingInterval.QUARTERLY, 90, BigDecimal.valueOf(249.00), "3-month continuous live broadcast with priority discovery placement", true));
        planRepository.save(new SubscriptionPlan(null, "Annual Pro Merchant Plan", PlanType.RECURRING_SUBSCRIPTION, BillingInterval.YEARLY, 365, BigDecimal.valueOf(899.00), "Full year listing, verified badge, and analytics access", true));

        // 4. Seed Demo Stall Owner
        User owner = User.builder()
                .fullName("Kumar Ramesh")
                .email("kumar@example.com")
                .phoneNumber("+919876543211")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(Role.SHOP_OWNER)
                .active(true)
                .build();
        User savedOwner = userRepository.save(owner);

        // 5. Seed Demo Shop: Kumar Mini Tiffin Shop (Near Central Chennai)
        Shop shop = Shop.builder()
                .ownerId(savedOwner.getId())
                .category(tiffinCat)
                .name("Kumar Mini Tiffin Shop")
                .slug("kumar-mini-tiffin-shop")
                .description("Authentic hot roadside tiffin, idli, crispy roast dosas, and filter coffee prepared fresh.")
                .phoneNumber("+919876543211")
                .addressLine("14 Central Station Road, Park Town")
                .city("Chennai")
                .state("Tamil Nadu")
                .postalCode("600003")
                .latitude(BigDecimal.valueOf(13.0827))
                .longitude(BigDecimal.valueOf(80.2707))
                .bannerImageUrl("https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80")
                .profileImageUrl("https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80")
                .verificationStatus(VerificationStatus.APPROVED)
                .temporarilyClosed(false)
                .build();
        Shop savedShop = shopRepository.save(shop);

        // Seed Operating Hours for shop (06:30 AM to 10:30 PM)
        for (int day = 1; day <= 7; day++) {
            hoursRepository.save(new ShopBusinessHours(
                    null,
                    savedShop.getId(),
                    day,
                    LocalTime.of(6, 30),
                    LocalTime.of(22, 30),
                    false
            ));
        }

        // 6. Seed Dishes with live availability
        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop.getId())
                .name("Plain Idli (2 Pcs)")
                .regionalName("இட்லி")
                .description("Steaming hot soft rice cakes served with sambar and fresh coconut chutney")
                .price(BigDecimal.valueOf(20.00))
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .enabled(true)
                .build());

        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop.getId())
                .name("Ghee Podi Masala Dosa")
                .regionalName("நெய் பொடி தோசை")
                .description("Crispy golden roast with spicy gunpowder, melted ghee and potato masala")
                .price(BigDecimal.valueOf(55.00))
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .enabled(true)
                .build());

        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop.getId())
                .name("Hot Ghee Pongal")
                .regionalName("வெண் பொங்கல்")
                .description("Traditional creamy pepper and cashew rice served with medu vada")
                .price(BigDecimal.valueOf(45.00))
                .availabilityStatus(AvailabilityStatus.SOLD_OUT)
                .enabled(true)
                .build());

        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop.getId())
                .name("Poori Masala (3 Pcs)")
                .regionalName("பூரி")
                .description("Fluffy golden pooris with spiced potato curry")
                .price(BigDecimal.valueOf(40.00))
                .availabilityStatus(AvailabilityStatus.LIMITED)
                .quantityTracked(true)
                .currentQuantity(5)
                .enabled(true)
                .build());

        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop.getId())
                .name("South Indian Filter Coffee")
                .regionalName("ஃபில்டர் காபி")
                .description("Freshly brewed strong chicory filter decoction with frothy hot milk")
                .price(BigDecimal.valueOf(15.00))
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .enabled(true)
                .build());

        // 7. Seed Demo Stall 2: Sharmaji Chaat Corner (Chaat & Snacks)
        User owner2 = User.builder()
                .fullName("Rakesh Sharma")
                .email("sharma@example.com")
                .phoneNumber("+919876543212")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(Role.SHOP_OWNER)
                .active(true)
                .build();
        User savedOwner2 = userRepository.save(owner2);

        Shop shop2 = Shop.builder()
                .ownerId(savedOwner2.getId())
                .category(teaCat)
                .name("Sharmaji Cutting Chai & Samosa")
                .slug("sharmaji-cutting-chai-samosa")
                .description("Famous hot ginger cardamom tea, hot samosas, and kachoris.")
                .phoneNumber("+919876543212")
                .addressLine("8 Evening Bazaar Road, Park Town")
                .city("Chennai")
                .state("Tamil Nadu")
                .postalCode("600003")
                .latitude(BigDecimal.valueOf(13.0850))
                .longitude(BigDecimal.valueOf(80.2740))
                .verificationStatus(VerificationStatus.APPROVED)
                .temporarilyClosed(false)
                .build();
        Shop savedShop2 = shopRepository.save(shop2);

        for (int day = 1; day <= 7; day++) {
            hoursRepository.save(new ShopBusinessHours(
                    null,
                    savedShop2.getId(),
                    day,
                    LocalTime.of(7, 0),
                    LocalTime.of(23, 0),
                    false
            ));
        }

        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop2.getId())
                .name("Special Adrak Chai")
                .regionalName("இஞ்சி டீ")
                .description("Strong boiled milk tea with crushed fresh ginger and cardamom")
                .price(BigDecimal.valueOf(12.00))
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .enabled(true)
                .build());

        foodItemRepository.save(FoodItem.builder()
                .shopId(savedShop2.getId())
                .name("Crispy Aloo Samosa")
                .regionalName("சமோசா")
                .description("Deep-fried pastry filled with spiced potato and peas, served with mint and tamarind chutney")
                .price(BigDecimal.valueOf(15.00))
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .enabled(true)
                .build());

        log.info("Platform seed data initialized successfully! Admin: admin@localbite.com | Shop: kumar@example.com");
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
