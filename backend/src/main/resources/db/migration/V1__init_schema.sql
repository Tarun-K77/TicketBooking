-- ================================================================
-- V1: Ticket Booking System — Initial Schema
-- ================================================================

-- ── Custom Enum Types ──────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ORGANISER', 'ADMIN');
CREATE TYPE seat_status AS ENUM ('AVAILABLE', 'HELD', 'BOOKED');
CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELLED');
CREATE TYPE waitlist_status AS ENUM ('WAITING', 'OFFERED', 'CLAIMED', 'EXPIRED');

-- ── Users ──────────────────────────────────────────────────────
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'CUSTOMER',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Venues ─────────────────────────────────────────────────────
CREATE TABLE venues (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seat Categories (per venue) ────────────────────────────────
CREATE TABLE seat_categories (
    id              BIGSERIAL PRIMARY KEY,
    venue_id        BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    row_start       INT NOT NULL,
    row_end         INT NOT NULL,
    cols            INT NOT NULL,
    color_hex       VARCHAR(7) DEFAULT '#3B82F6'
);

-- ── Events ─────────────────────────────────────────────────────
CREATE TABLE events (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    event_type      VARCHAR(50) NOT NULL,
    venue_id        BIGINT NOT NULL REFERENCES venues(id),
    organiser_id    BIGINT NOT NULL REFERENCES users(id),
    event_date      DATE NOT NULL,
    event_time      TIME NOT NULL,
    image_url       VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Event Pricing (per category per event) ─────────────────────
CREATE TABLE event_pricing (
    id              BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    category_id     BIGINT NOT NULL REFERENCES seat_categories(id),
    price           NUMERIC(10,2) NOT NULL,
    UNIQUE(event_id, category_id)
);

-- ── Show Seats (materialized per event) ────────────────────────
CREATE TABLE show_seats (
    id              BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    category_id     BIGINT NOT NULL REFERENCES seat_categories(id),
    row_label       VARCHAR(5) NOT NULL,
    seat_number     INT NOT NULL,
    status          seat_status NOT NULL DEFAULT 'AVAILABLE',
    held_by         BIGINT REFERENCES users(id),
    held_at         TIMESTAMPTZ,
    version         INT NOT NULL DEFAULT 0,
    UNIQUE(event_id, row_label, seat_number)
);

CREATE INDEX idx_show_seats_event_status ON show_seats(event_id, status);
CREATE INDEX idx_show_seats_held_at ON show_seats(held_at) WHERE status = 'HELD';

-- ── Bookings ───────────────────────────────────────────────────
CREATE TABLE bookings (
    id              BIGSERIAL PRIMARY KEY,
    booking_ref     VARCHAR(64) UNIQUE NOT NULL,
    event_id        BIGINT NOT NULL REFERENCES events(id),
    customer_id     BIGINT NOT NULL REFERENCES users(id),
    total_amount    NUMERIC(10,2) NOT NULL,
    status          booking_status NOT NULL DEFAULT 'CONFIRMED',
    signature       TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at    TIMESTAMPTZ
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);

-- ── Booking ↔ Seats (junction) ─────────────────────────────────
CREATE TABLE booking_seats (
    id              BIGSERIAL PRIMARY KEY,
    booking_id      BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    show_seat_id    BIGINT NOT NULL REFERENCES show_seats(id)
);

-- ── Waitlist ───────────────────────────────────────────────────
CREATE TABLE waitlist (
    id              BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL REFERENCES events(id),
    category_id     BIGINT NOT NULL REFERENCES seat_categories(id),
    customer_id     BIGINT NOT NULL REFERENCES users(id),
    offer_token     VARCHAR(128),
    offer_expires   TIMESTAMPTZ,
    status          waitlist_status NOT NULL DEFAULT 'WAITING',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, category_id, customer_id)
);

CREATE INDEX idx_waitlist_event_category ON waitlist(event_id, category_id, status);

-- ── Seed Admin User ────────────────────────────────────────────
-- Password: admin123 (BCrypt hash)
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@ticketbooking.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'System Admin',
        'ADMIN');
