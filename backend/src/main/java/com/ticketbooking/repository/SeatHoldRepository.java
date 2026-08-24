package com.ticketbooking.repository;

import com.ticketbooking.entity.SeatHold;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SeatHoldRepository extends JpaRepository<SeatHold, Long> {
    List<SeatHold> findByStatusAndExpiresAtBefore(String status, LocalDateTime time);
    List<SeatHold> findByEventSeatIdAndStatus(Long eventSeatId, String status);
}
