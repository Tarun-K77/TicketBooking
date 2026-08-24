package com.ticketbooking.controller;

import com.ticketbooking.dto.EventRequest;
import com.ticketbooking.entity.*;
import com.ticketbooking.repository.*;
import com.ticketbooking.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventSeatRepository eventSeatRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VenueRepository venueRepository;
    
    @Autowired
    private SeatRepository seatRepository;

    @GetMapping("/public")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/public/{id}/seats")
    public List<EventSeat> getEventSeats(@PathVariable Long id) {
        return eventSeatRepository.findByEventId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANISER')")
    public ResponseEntity<Event> createEvent(@RequestBody EventRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User organiser = userRepository.findById(userDetails.getId()).orElseThrow();
        Venue venue = venueRepository.findById(request.getVenueId()).orElseThrow();
        
        Event event = new Event();
        event.setName(request.getName());
        event.setType(request.getType());
        event.setDescription(request.getDescription());
        event.setCoverImageUrl(request.getCoverImageUrl());
        event.setDate(request.getDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(venue);
        event.setOrganiser(organiser);
        
        Event savedEvent = eventRepository.save(event);
        
        // Generate EventSeats
        List<Seat> venueSeats = seatRepository.findByVenueId(venue.getId());
        for (Seat seat : venueSeats) {
            if (seat.getActive()) {
                EventSeat eventSeat = new EventSeat();
                eventSeat.setEvent(savedEvent);
                eventSeat.setSeat(seat);
                
                Double price = request.getCategoryPrices().get(seat.getCategory().getId());
                if (price == null) price = 100.0;
                
                eventSeat.setPrice(price);
                eventSeat.setStatus("AVAILABLE");
                eventSeatRepository.save(eventSeat);
            }
        }
        
        return ResponseEntity.ok(savedEvent);
    }
}
