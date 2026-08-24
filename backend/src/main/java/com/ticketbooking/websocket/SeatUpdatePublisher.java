package com.ticketbooking.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class SeatUpdatePublisher {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void publishSeatUpdate(Long eventId, Long eventSeatId, String newStatus) {
        messagingTemplate.convertAndSend("/topic/events/" + eventId + "/seats", 
            (Object) Map.of("eventSeatId", eventSeatId, "status", newStatus));
    }
}
