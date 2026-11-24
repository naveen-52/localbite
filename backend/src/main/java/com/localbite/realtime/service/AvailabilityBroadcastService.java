package com.localbite.realtime.service;

import com.localbite.food.dto.AvailabilityEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class AvailabilityBroadcastService {

    private static final Logger log = LoggerFactory.getLogger(AvailabilityBroadcastService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public AvailabilityBroadcastService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastAvailabilityChange(AvailabilityEventDto event) {
        String destination = "/topic/shop/" + event.getShopId() + "/availability";
        log.info("Broadcasting live availability to destination {}: foodId={} status={}",
                destination, event.getFoodItemId(), event.getStatus());
        messagingTemplate.convertAndSend(destination, event);
    }
}
