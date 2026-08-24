# Ticket Booking System - System Design

## 1. Concurrency Prevention & Optimistic Locking
The system uses SQLite as the primary database, which is traditionally a single-writer database and struggles under concurrent writer load. 
To guarantee correctness (two customers never holding/booking the same seat):
- We utilize atomic UPDATE queries in the database: `UPDATE event_seat SET status = 'HELD' WHERE id = ? AND status = 'AVAILABLE'`.
- If the return count is 0, another transaction has already modified the seat, and we return a `409 Conflict`.
- This ensures absolute atomic consistency at the database engine level, avoiding double-bookings.

## 2. Seat Hold and TTL Mechanism
When a customer selects a seat, it transitions from `AVAILABLE` to `HELD`.
- A `SeatHold` record is created with an `expiresAt` timestamp (default TTL is 10 minutes).
- The `EventSeat` status is immediately updated to `HELD`, preventing other users from selecting it.
- **Auto-Release:** A Spring `@Scheduled` task (`HoldExpiryScheduler`) runs continuously in the background. It finds all `SeatHold` records where `expiresAt < now()` and `status = ACTIVE`. For each expired hold, it updates the `EventSeat` back to `AVAILABLE` and marks the hold as `EXPIRED`.

## 3. Waitlist Queue & Auto-Assignment
The waitlist is category-specific (e.g., Premium). 
- When an event is sold out in a category, users join the `Waitlist` (FIFO queue via `queuePosition`).
- On booking cancellation, the `WaitlistService` identifies the first eligible user and generates a `WaitlistOffer`.
- The `EventSeat` is set to `HELD` implicitly for that user, and a time-limited offer (TTL 10 mins) is sent via email.
- **Offer Expiry:** A background job sweeps expired `WaitlistOffer`s. If an offer expires before acceptance, the system automatically allocates it to the next waitlisted user.

## 4. Real-time Seat Updates (WebSocket)
To provide a live visual seat map, the backend publishes STOMP messages over WebSocket.
- The React frontend subscribes to `/topic/events/{eventId}/seats`.
- When any user holds, releases, or books a seat, `SeatUpdatePublisher` broadcasts the `eventSeatId` and `newStatus`.
- The frontend updates the specific seat's color immediately, without page refreshes.

## 5. QR Code & Email Workflow
- Upon successful payment/checkout, the system marks the seat `BOOKED` and generates a secure UUID `bookingReference`.
- The `QrCodeService` uses Google ZXing to generate a PNG Base64 string of a QR Code containing the booking reference.
- The `EmailService` connects to an SMTP server (e.g., Mailtrap/SendGrid) and dispatches an HTML email containing the booking details and the embedded QR Code ticket.
