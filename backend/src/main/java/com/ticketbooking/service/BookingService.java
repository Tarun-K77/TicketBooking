package com.ticketbooking.service;

import com.ticketbooking.entity.*;
import com.ticketbooking.repository.*;
import com.ticketbooking.qr.QrCodeService;
import com.ticketbooking.email.EmailService;
import com.ticketbooking.websocket.SeatUpdatePublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BookingSeatRepository bookingSeatRepository;
    
    @Autowired
    private SeatHoldRepository seatHoldRepository;
    
    @Autowired
    private EventSeatRepository eventSeatRepository;
    
    @Autowired
    private QrCodeService qrCodeService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private WaitlistService waitlistService;
    
    @Autowired
    private SeatUpdatePublisher seatUpdatePublisher;

    @Transactional
    public Booking createBooking(User customer, Event event, List<Long> holdIds) {
        double totalAmount = 0;
        
        for (Long holdId : holdIds) {
            SeatHold hold = seatHoldRepository.findById(holdId).orElseThrow();
            if (!hold.getStatus().equals("ACTIVE") || !hold.getUser().getId().equals(customer.getId())) {
                throw new RuntimeException("Invalid hold");
            }
            totalAmount += hold.getEventSeat().getPrice();
        }

        Booking booking = new Booking();
        booking.setBookingReference(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setCustomer(customer);
        booking.setEvent(event);
        booking.setStatus("CONFIRMED");
        booking.setAmount(totalAmount);
        
        booking = bookingRepository.save(booking);
        
        for (Long holdId : holdIds) {
            SeatHold hold = seatHoldRepository.findById(holdId).orElseThrow();
            EventSeat eventSeat = hold.getEventSeat();
            
            // Update EventSeat status
            eventSeat.setStatus("BOOKED");
            eventSeatRepository.save(eventSeat);
            
            // Mark hold as completed
            hold.setStatus("COMPLETED");
            seatHoldRepository.save(hold);
            
            // Create booking seat
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(booking);
            bookingSeat.setEventSeat(eventSeat);
            bookingSeat.setPrice(eventSeat.getPrice());
            bookingSeatRepository.save(bookingSeat);
            
            totalAmount += eventSeat.getPrice();
            
            // Publish update
            seatUpdatePublisher.publishSeatUpdate(event.getId(), eventSeat.getId(), "BOOKED");
        }
        
        booking.setAmount(totalAmount);
        booking = bookingRepository.save(booking);
        
        // Generate QR and Email
        String qr = qrCodeService.generateQrCodeBase64(booking.getBookingReference(), 250, 250);
        Booking finalBooking = booking;
        new Thread(() -> {
            emailService.sendBookingConfirmation(customer.getEmail(), event.getName(), finalBooking.getBookingReference(), qr);
        }).start();
        
        return booking;
    }
    
    @Transactional
    public void cancelBooking(Long bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (!booking.getStatus().equals("CONFIRMED")) {
            throw new RuntimeException("Cannot cancel");
        }
        
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        
        List<BookingSeat> seats = bookingSeatRepository.findByBookingId(bookingId);
        for (BookingSeat bs : seats) {
            EventSeat es = bs.getEventSeat();
            es.setStatus("AVAILABLE");
            eventSeatRepository.save(es);
            seatUpdatePublisher.publishSeatUpdate(es.getEvent().getId(), es.getId(), "AVAILABLE");
            
            // Trigger Waitlist allocation
            waitlistService.allocateAvailableSeat(es);
        }
    }
}
