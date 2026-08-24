package com.ticketbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist_offers")
@Data
public class WaitlistOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waitlist_id", nullable = false)
    private Waitlist waitlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_seat_id", nullable = false)
    private EventSeat eventSeat;

    @Column(nullable = false)
    private LocalDateTime offeredAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // ACTIVE, ACCEPTED, EXPIRED
    @Column(nullable = false)
    private String status = "ACTIVE";
}
