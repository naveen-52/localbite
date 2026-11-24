package com.localbite.shop.service;

import com.localbite.shop.dto.ShopStatusDto;
import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.ShopBusinessHours;
import com.localbite.shop.repository.ShopBusinessHoursRepository;
import com.localbite.shop.repository.ShopHolidayRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class ShopTimingService {

    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    private final ShopBusinessHoursRepository businessHoursRepository;
    private final ShopHolidayRepository holidayRepository;

    public ShopTimingService(
            ShopBusinessHoursRepository businessHoursRepository,
            ShopHolidayRepository holidayRepository) {
        this.businessHoursRepository = businessHoursRepository;
        this.holidayRepository = holidayRepository;
    }

    @Transactional(readOnly = true)
    public ShopStatusDto computeShopStatus(Shop shop) {
        // 1. Check if manually closed by vendor
        if (shop.isTemporarilyClosed()) {
            String reason = shop.getClosureReason() != null ? shop.getClosureReason() : "Temporarily Closed";
            return ShopStatusDto.closed("Closed: " + reason, null);
        }

        ZonedDateTime nowZoned = ZonedDateTime.now(DEFAULT_ZONE);
        LocalDate today = nowZoned.toLocalDate();
        LocalTime now = nowZoned.toLocalTime();

        // 2. Check if today is a configured holiday
        if (holidayRepository.existsByShopIdAndHolidayDate(shop.getId(), today)) {
            return ShopStatusDto.closed("Closed for Holiday today", null);
        }

        // 3. Check regular weekly schedule
        int dayOfWeek = today.getDayOfWeek().getValue(); // 1 = Monday, 7 = Sunday
        Optional<ShopBusinessHours> hoursOpt = businessHoursRepository.findByShopIdAndDayOfWeek(shop.getId(), dayOfWeek);

        if (hoursOpt.isEmpty() || hoursOpt.get().isClosed()) {
            return ShopStatusDto.closed("Closed today", null);
        }

        ShopBusinessHours hours = hoursOpt.get();
        LocalTime openTime = hours.getOpenTime();
        LocalTime closeTime = hours.getCloseTime();

        // 4. Handle Daytime vs Midnight-Crossing Business Hours
        boolean isOpen;
        if (!openTime.isAfter(closeTime)) {
            // Normal daytime schedule (e.g. 07:00 AM to 09:00 PM)
            isOpen = !now.isBefore(openTime) && !now.isAfter(closeTime);
        } else {
            // Overnight / Midnight-crossing schedule (e.g. 08:00 PM to 02:00 AM)
            isOpen = !now.isBefore(openTime) || !now.isAfter(closeTime);
        }

        if (isOpen) {
            return ShopStatusDto.open("Open until " + closeTime.format(TIME_FORMATTER), closeTime);
        } else if (now.isBefore(openTime)) {
            return ShopStatusDto.closed("Opens at " + openTime.format(TIME_FORMATTER), openTime);
        } else {
            return ShopStatusDto.closed("Closed for the day", null);
        }
    }
}
