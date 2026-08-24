import os

base_path = "/Users/tarun/.gemini/antigravity/scratch/ticket-booking-system/backend/src/main/java/com/ticketbooking/"

files = {
    "entity/EventPricing.java": """package com.ticketbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity @Table(name = "event_pricing")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EventPricing {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private SeatCategory category;
    
    private BigDecimal price;
}
""",
    "entity/ShowSeat.java": """package com.ticketbooking.entity;

import com.ticketbooking.enums.SeatStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity @Table(name = "show_seats")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ShowSeat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private SeatCategory category;
    
    @Column(name = "row_label")
    private String rowLabel;
    
    @Column(name = "seat_number")
    private int seatNumber;
    
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SeatStatus status;
    
    @Column(name = "held_by")
    private Long heldBy;
    
    @Column(name = "held_at")
    private Instant heldAt;
    
    @Version
    private int version;
}
""",
    "entity/Booking.java": """package com.ticketbooking.entity;

import com.ticketbooking.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity @Table(name = "bookings")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "booking_ref")
    private String bookingRef;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private BookingStatus status;
    
    private String signature;
    
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "cancelled_at")
    private Instant cancelledAt;
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<BookingSeat> seats;
}
""",
    "entity/BookingSeat.java": """package com.ticketbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "booking_seats")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingSeat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;
    
    @ManyToOne
    @JoinColumn(name = "show_seat_id")
    private ShowSeat showSeat;
}
""",
    "entity/WaitlistEntry.java": """package com.ticketbooking.entity;

import com.ticketbooking.enums.WaitlistStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity @Table(name = "waitlist")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WaitlistEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private SeatCategory category;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;
    
    @Column(name = "offer_token")
    private String offerToken;
    
    @Column(name = "offer_expires")
    private Instant offerExpires;
    
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private WaitlistStatus status;
    
    @Column(name = "created_at")
    private Instant createdAt;
}
""",
    "repository/UserRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
""",
    "repository/VenueRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}
""",
    "repository/SeatCategoryRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.SeatCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatCategoryRepository extends JpaRepository<SeatCategory, Long> {
    List<SeatCategory> findByVenueId(Long venueId);
}
""",
    "repository/EventRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganiserId(Long organiserId);
    List<Event> findByEventDateGreaterThanEqual(LocalDate date);
    
    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(@Param("query") String query1, @Param("query") String query2);
}
""",
    "repository/EventPricingRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.EventPricing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventPricingRepository extends JpaRepository<EventPricing, Long> {
    List<EventPricing> findByEventId(Long eventId);
    Optional<EventPricing> findByEventIdAndCategoryId(Long eventId, Long categoryId);
}
""",
    "repository/ShowSeatRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.ShowSeat;
import com.ticketbooking.enums.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {
    List<ShowSeat> findByEventId(Long eventId);
    List<ShowSeat> findByEventIdAndStatus(Long eventId, SeatStatus status);
    List<ShowSeat> findByEventIdAndCategoryIdAndStatus(Long eventId, Long categoryId, SeatStatus status);
    
    @Query("SELECT s FROM ShowSeat s WHERE s.status = 'HELD' AND s.heldAt < :cutoff")
    List<ShowSeat> findExpiredHolds(@Param("cutoff") Instant cutoff);
    
    long countByEventIdAndCategoryIdAndStatus(Long eventId, Long categoryId, SeatStatus status);
}
""",
    "repository/BookingRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByEventId(Long eventId);
    Optional<Booking> findByBookingRef(String bookingRef);
}
""",
    "repository/BookingSeatRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByBookingId(Long bookingId);
}
""",
    "repository/WaitlistRepository.java": """package com.ticketbooking.repository;

import com.ticketbooking.entity.WaitlistEntry;
import com.ticketbooking.enums.WaitlistStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {
    List<WaitlistEntry> findByEventIdAndCategoryIdAndStatusOrderByCreatedAtAsc(Long eventId, Long categoryId, WaitlistStatus status);
    Optional<WaitlistEntry> findByOfferToken(String token);
    List<WaitlistEntry> findByCustomerIdAndStatus(Long customerId, WaitlistStatus status);
    
    @Query("SELECT w FROM WaitlistEntry w WHERE w.status = 'OFFERED' AND w.offerExpires < :now")
    List<WaitlistEntry> findExpiredOffers(@Param("now") Instant now);
    
    boolean existsByEventIdAndCategoryIdAndCustomerId(Long eventId, Long categoryId, Long customerId);
}
""",
    "dto/AuthRequest.java": """package com.ticketbooking.dto;
public record AuthRequest(String email, String password, String fullName, String role) {}
""",
    "dto/AuthResponse.java": """package com.ticketbooking.dto;
public record AuthResponse(String token, String email, String fullName, String role) {}
""",
    "dto/VenueRequest.java": """package com.ticketbooking.dto;
import java.util.List;
public record VenueRequest(String name, String address, List<SeatCategoryRequest> categories) {}
""",
    "dto/SeatCategoryRequest.java": """package com.ticketbooking.dto;
public record SeatCategoryRequest(String name, int rowStart, int rowEnd, int cols, String colorHex) {}
""",
    "dto/EventRequest.java": """package com.ticketbooking.dto;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
public record EventRequest(String title, String description, String eventType, Long venueId, LocalDate eventDate, LocalTime eventTime, String imageUrl, List<PricingRequest> pricing) {}
""",
    "dto/PricingRequest.java": """package com.ticketbooking.dto;
import java.math.BigDecimal;
public record PricingRequest(Long categoryId, BigDecimal price) {}
""",
    "dto/SeatHoldRequest.java": """package com.ticketbooking.dto;
import java.util.List;
public record SeatHoldRequest(List<Long> seatIds) {}
""",
    "dto/BookingRequest.java": """package com.ticketbooking.dto;
import java.util.List;
public record BookingRequest(Long eventId, List<Long> seatIds) {}
""",
    "dto/SeatStatusUpdate.java": """package com.ticketbooking.dto;
public record SeatStatusUpdate(Long seatId, String rowLabel, int seatNumber, String status, Long categoryId) {}
""",
    "dto/BookingSummaryResponse.java": """package com.ticketbooking.dto;
import java.math.BigDecimal;
import java.util.Map;
public record BookingSummaryResponse(long totalBookings, long confirmedBookings, long cancelledBookings, BigDecimal totalRevenue, Map<String, CategorySummary> categoryBreakdown) {
    public record CategorySummary(long booked, long available, long total, BigDecimal revenue) {}
}
""",
    "dto/ApiResponse.java": """package com.ticketbooking.dto;
public record ApiResponse<T>(boolean success, String message, T data) {
    public static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>(true, "Success", data); }
    public static <T> ApiResponse<T> ok(String message, T data) { return new ApiResponse<>(true, message, data); }
    public static <T> ApiResponse<T> error(String message) { return new ApiResponse<>(false, message, null); }
}
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_path, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)
    print(f"Created {full_path}")
