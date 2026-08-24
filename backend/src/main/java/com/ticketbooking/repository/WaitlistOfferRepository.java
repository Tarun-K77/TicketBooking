package com.ticketbooking.repository;

import com.ticketbooking.entity.WaitlistOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface WaitlistOfferRepository extends JpaRepository<WaitlistOffer, Long> {
    List<WaitlistOffer> findByStatusAndExpiresAtBefore(String status, LocalDateTime time);
}
