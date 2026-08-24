package com.ticketbooking.repository;

import com.ticketbooking.entity.EventSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EventSeatRepository extends JpaRepository<EventSeat, Long> {
    List<EventSeat> findByEventId(Long eventId);
    
    // Optimistic locking alternative: atomic update for holding a seat
    @Modifying
    @Query("UPDATE EventSeat e SET e.status = :newStatus WHERE e.id = :id AND e.status = :expectedStatus")
    int updateStatusIfExpected(@Param("id") Long id, @Param("expectedStatus") String expectedStatus, @Param("newStatus") String newStatus);
}
