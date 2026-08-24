package com.ticketbooking.controller;

import com.ticketbooking.entity.Event;
import com.ticketbooking.entity.SeatCategory;
import com.ticketbooking.entity.User;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.SeatCategoryRepository;
import com.ticketbooking.repository.UserRepository;
import com.ticketbooking.security.UserDetailsImpl;
import com.ticketbooking.service.WaitlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {
    @Autowired
    private WaitlistService waitlistService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private SeatCategoryRepository seatCategoryRepository;

    @PostMapping("/join")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> joinWaitlist(@RequestParam Long eventId, @RequestParam Long categoryId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();
        SeatCategory category = seatCategoryRepository.findById(categoryId).orElseThrow();
        
        waitlistService.joinWaitlist(event, category, user);
        return ResponseEntity.ok().build();
    }
}
