package com.ticketbooking.controller;

import com.ticketbooking.dto.HoldRequest;
import com.ticketbooking.entity.SeatHold;
import com.ticketbooking.entity.User;
import com.ticketbooking.repository.UserRepository;
import com.ticketbooking.security.UserDetailsImpl;
import com.ticketbooking.service.SeatHoldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/holds")
public class SeatHoldController {
    @Autowired
    private SeatHoldService seatHoldService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> holdSeat(@RequestBody HoldRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            User user = userRepository.findById(userDetails.getId()).orElseThrow();
            SeatHold hold = seatHoldService.holdSeat(request.getEventSeatId(), user);
            return ResponseEntity.ok(hold);
        } catch (Exception e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{holdId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> releaseHold(@PathVariable Long holdId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        seatHoldService.releaseHold(holdId, user);
        return ResponseEntity.ok().build();
    }
}
