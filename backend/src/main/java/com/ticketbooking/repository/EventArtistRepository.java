package com.ticketbooking.repository;

import com.ticketbooking.entity.EventArtist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventArtistRepository extends JpaRepository<EventArtist, Long> {
    List<EventArtist> findByEventId(Long eventId);
}
