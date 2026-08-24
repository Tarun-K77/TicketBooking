package com.ticketbooking.repository;

import com.ticketbooking.entity.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {
    List<Waitlist> findByEventIdAndSeatCategoryIdOrderByQueuePositionAsc(Long eventId, Long seatCategoryId);
    
    @Query("SELECT MAX(w.queuePosition) FROM Waitlist w WHERE w.event.id = :eventId AND w.seatCategory.id = :seatCategoryId")
    Integer findMaxQueuePosition(Long eventId, Long seatCategoryId);
    
    Optional<Waitlist> findFirstByEventIdAndSeatCategoryIdAndStatusOrderByQueuePositionAsc(Long eventId, Long seatCategoryId, String status);
}
