# Ticket Booking System - Showpass

**🔴 Live Demo:** [https://ticket-booking-iota-six.vercel.app](https://ticket-booking-iota-six.vercel.app)

A production-quality full-stack Ticket Booking System for movies and concerts featuring a District-inspired modern UI.

## Features
- **Visual Seat Selection**: Interactive grid with real-time WebSocket updates.
- **Seat Hold & TTL**: Configurable TTL with atomic concurrency protection (SQLite atomic updates) and scheduled auto-release.
- **Waitlist Auto-Assignment**: Automatic time-limited offers to queued customers on cancellation.
- **QR Ticket & Email**: Booking references encoded into ZXing QR codes and emailed via Spring Mail.
- **Role-Based Auth**: Customer, Organiser, Admin roles via JWT authentication.
- **Premium UI**: Modern entertainment application feel, built entirely with custom CSS.

## Setup Instructions

### Environment Variables (.env)
Create a `.env` in the `backend` folder based on `.env.example`.

### Run Backend
1. Ensure Java 17/21 and Maven are installed.
2. `cd backend`
3. `mvn clean install`
4. `mvn spring-boot:run`
(The SQLite database `ticket_booking.db` will be auto-generated).

### Run Frontend
1. Ensure Node.js is installed.
2. `cd frontend`
3. `npm install`
4. `npm run dev`

### Production Deployment
- **Frontend**: Deployable to Vercel/Netlify.
- **Backend**: Can be hosted on Railway, Render, or a VPS. **Important:** Because SQLite uses a local file, if deploying to an ephemeral container platform (like Render Free Tier), persistent disk storage (Volumes) must be attached, otherwise database data will be lost on container restart.
