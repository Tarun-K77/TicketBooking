package com.ticketbooking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "event_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "seat_id"})
})
@Data
public class EventSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(nullable = false)
    private Double price;

    // AVAILABLE, HELD, BOOKED
    @Column(nullable = false)
    private String status = "AVAILABLE";

    @Version
    private Long version;
}
