package com.ticketbooking.service;

import com.ticketbooking.entity.*;
import com.ticketbooking.repository.*;
import com.ticketbooking.websocket.SeatUpdatePublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SeatHoldService {
    @Autowired
    private SeatHoldRepository seatHoldRepository;
    
    @Autowired
    private EventSeatRepository eventSeatRepository;
    
    @Autowired
    private SeatUpdatePublisher seatUpdatePublisher;
    
    @Value("${app.seat.hold-ttl-minutes:10}")
    private int holdTtl;

    @Transactional
    public SeatHold holdSeat(Long eventSeatId, User user) {
        EventSeat seat = eventSeatRepository.findById(eventSeatId).orElseThrow(() -> new RuntimeException("Seat not found"));
        
        // SQLite Concurrency Protection: use pessimistic atomic update instead of standard find-then-update
        int updated = eventSeatRepository.updateStatusIfExpected(seat.getId(), "AVAILABLE", "HELD");
        if (updated == 0) {
            throw new RuntimeException("Conflict: Seat is no longer available.");
        }
        
        seat = eventSeatRepository.findById(eventSeatId).get();
        
        SeatHold hold = new SeatHold();
        hold.setEventSeat(seat);
        hold.setUser(user);
        hold.setExpiresAt(LocalDateTime.now().plusMinutes(holdTtl));
        hold.setStatus("ACTIVE");
        
        hold = seatHoldRepository.save(hold);
        
        seatUpdatePublisher.publishSeatUpdate(seat.getEvent().getId(), seat.getId(), "HELD");
        
        return hold;
    }
    
    @Transactional
    public void releaseHold(Long holdId, User user) {
        SeatHold hold = seatHoldRepository.findById(holdId).orElseThrow();
        if (!hold.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (hold.getStatus().equals("ACTIVE")) {
            hold.setStatus("RELEASED");
            seatHoldRepository.save(hold);
            
            EventSeat seat = hold.getEventSeat();
            seat.setStatus("AVAILABLE");
            eventSeatRepository.save(seat);
            
            seatUpdatePublisher.publishSeatUpdate(seat.getEvent().getId(), seat.getId(), "AVAILABLE");
        }
    }

    @Transactional
    public void expireHolds() {
        List<SeatHold> expiredHolds = seatHoldRepository.findByStatusAndExpiresAtBefore("ACTIVE", LocalDateTime.now());
        for (SeatHold hold : expiredHolds) {
            hold.setStatus("EXPIRED");
            seatHoldRepository.save(hold);
            
            EventSeat seat = hold.getEventSeat();
            if (seat.getStatus().equals("HELD")) {
                seat.setStatus("AVAILABLE");
                eventSeatRepository.save(seat);
                seatUpdatePublisher.publishSeatUpdate(seat.getEvent().getId(), seat.getId(), "AVAILABLE");
            }
        }
    }
}
