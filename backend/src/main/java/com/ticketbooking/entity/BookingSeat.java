package com.ticketbooking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "booking_seats")
@Data
public class BookingSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_seat_id", nullable = false)
    private EventSeat eventSeat;
    
    @Column(nullable = false)
    private Double price;
}
