package com.ticketbooking.scheduler;

import com.ticketbooking.service.SeatHoldService;
import com.ticketbooking.service.WaitlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class HoldExpiryScheduler {
    
    @Autowired
    private SeatHoldService seatHoldService;
    
    @Autowired
    private WaitlistService waitlistService;

    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void releaseExpiredHolds() {
        seatHoldService.expireHolds();
    }
    
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void releaseExpiredWaitlistOffers() {
        waitlistService.expireOffers();
    }
}
