package com.ticketbooking.service;

import com.ticketbooking.entity.*;
import com.ticketbooking.repository.*;
import com.ticketbooking.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Service
public class WaitlistService {
    @Autowired
    private WaitlistRepository waitlistRepository;
    
    @Autowired
    private WaitlistOfferRepository waitlistOfferRepository;
    
    @Autowired
    private EventSeatRepository eventSeatRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${app.waitlist.offer-ttl-minutes:10}")
    private int offerTtl;

    @Transactional
    public void joinWaitlist(Event event, SeatCategory category, User customer) {
        Integer maxPos = waitlistRepository.findMaxQueuePosition(event.getId(), category.getId());
        int position = (maxPos == null ? 0 : maxPos) + 1;
        
        Waitlist waitlist = new Waitlist();
        waitlist.setEvent(event);
        waitlist.setSeatCategory(category);
        waitlist.setCustomer(customer);
        waitlist.setQueuePosition(position);
        waitlist.setStatus("WAITING");
        waitlistRepository.save(waitlist);
    }
    
    @Transactional
    public void allocateAvailableSeat(EventSeat eventSeat) {
        Long eventId = eventSeat.getEvent().getId();
        Long categoryId = eventSeat.getSeat().getCategory().getId();
        
        Optional<Waitlist> nextInLine = waitlistRepository.findFirstByEventIdAndSeatCategoryIdAndStatusOrderByQueuePositionAsc(eventId, categoryId, "WAITING");
        
        if (nextInLine.isPresent()) {
            Waitlist waitlist = nextInLine.get();
            waitlist.setStatus("OFFERED");
            waitlistRepository.save(waitlist);
            
            WaitlistOffer offer = new WaitlistOffer();
            offer.setWaitlist(waitlist);
            offer.setEventSeat(eventSeat);
            offer.setExpiresAt(LocalDateTime.now().plusMinutes(offerTtl));
            offer.setStatus("ACTIVE");
            waitlistOfferRepository.save(offer);
            
            eventSeat.setStatus("HELD"); // Mark it as HELD for the waitlist user temporarily
            eventSeatRepository.save(eventSeat);
            
            emailService.sendWaitlistOffer(waitlist.getCustomer().getEmail(), eventSeat.getEvent().getName());
        }
    }
    
    @Transactional
    public void expireOffers() {
        List<WaitlistOffer> expiredOffers = waitlistOfferRepository.findByStatusAndExpiresAtBefore("ACTIVE", LocalDateTime.now());
        for (WaitlistOffer offer : expiredOffers) {
            offer.setStatus("EXPIRED");
            waitlistOfferRepository.save(offer);
            
            Waitlist waitlist = offer.getWaitlist();
            waitlist.setStatus("EXPIRED");
            waitlistRepository.save(waitlist);
            
            EventSeat seat = offer.getEventSeat();
            seat.setStatus("AVAILABLE");
            eventSeatRepository.save(seat);
            
            // Try to allocate to the next person
            allocateAvailableSeat(seat);
        }
    }
}
