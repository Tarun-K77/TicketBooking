package com.ticketbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_holds")
@Data
public class SeatHold {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_seat_id", nullable = false)
    private EventSeat eventSeat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime heldAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // ACTIVE, EXPIRED, COMPLETED
    @Column(nullable = false)
    private String status = "ACTIVE";
}
