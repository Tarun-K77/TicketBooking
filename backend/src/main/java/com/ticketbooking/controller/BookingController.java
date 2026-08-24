package com.ticketbooking.controller;

import com.ticketbooking.dto.BookingRequest;
import com.ticketbooking.entity.Booking;
import com.ticketbooking.entity.Event;
import com.ticketbooking.entity.User;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.UserRepository;
import com.ticketbooking.repository.BookingRepository;
import com.ticketbooking.security.UserDetailsImpl;
import com.ticketbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            User user = userRepository.findById(userDetails.getId()).orElseThrow();
            Event event = eventRepository.findById(request.getEventId()).orElseThrow();
            Booking booking = bookingService.createBooking(user, event, request.getHoldIds());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Booking> getMyBookings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return bookingRepository.findByCustomerId(userDetails.getId());
    }
    
    @PostMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            User user = userRepository.findById(userDetails.getId()).orElseThrow();
            bookingService.cancelBooking(bookingId, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @Autowired
    private com.ticketbooking.qr.QrCodeService qrCodeService;

    @GetMapping("/{bookingId}/qr")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getBookingQrCode(@PathVariable Long bookingId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getCustomer().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        String seatsStr = booking.getSeats().stream()
                .map(s -> s.getEventSeat().getSeat().getRow() + s.getEventSeat().getSeat().getNumber())
                .collect(Collectors.joining(", "));
        
        String eventName = java.net.URLEncoder.encode(booking.getEvent().getName(), java.nio.charset.StandardCharsets.UTF_8);
        String timeStr = java.net.URLEncoder.encode(booking.getEvent().getStartTime().toString(), java.nio.charset.StandardCharsets.UTF_8);
        String seatsEncoded = java.net.URLEncoder.encode(seatsStr, java.nio.charset.StandardCharsets.UTF_8);
        
        String qrPayload = String.format("https://ticket-booking-iota-six.vercel.app/ticket?ref=%s&event=%s&time=%s&seats=%s",
                booking.getBookingReference(),
                eventName,
                timeStr,
                seatsEncoded
        );
        String qrBase64 = qrCodeService.generateQrCodeBase64(qrPayload, 250, 250);
        return ResponseEntity.ok(qrBase64);
    }
}
