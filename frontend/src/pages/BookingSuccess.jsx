import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    if (!booking) {
      navigate('/');
      return;
    }

    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && booking.id) {
      axios.get(`https://ticketbooking-ycov.onrender.com/api/bookings/${booking.id}/qr`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then(res => setQrCode(res.data))
      .catch(err => console.error("Failed to load QR code", err));
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const event = booking.event;
  const seats = booking.seats.map(s => `${s.eventSeat.seat.row}${s.eventSeat.seat.number}`).join(', ');
  const totalAmount = booking.seats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', marginBottom: '1.5rem' }}>
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your tickets have been confirmed.</p>
      </div>

      <div style={{ 
        background: 'var(--bg-secondary)', 
        borderRadius: '24px', 
        border: '1px solid var(--border-color)', 
        width: '100%', 
        maxWidth: '400px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        {/* Ticket Header */}
        <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', borderBottom: '1px dashed var(--border-color)' }}>
          <img src={event.coverImageUrl} alt={event.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{event.name}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              {event.type === 'MOVIE' ? 'UA16+ • English' : 'All Ages • Live Event'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {event.venue.name} - {event.venue.location}
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div style={{ padding: '1.5rem', borderBottom: '1px dashed var(--border-color)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}, {event.startTime.substring(0, 5)}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Seats: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{seats}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px' }}>
              {qrCode ? (
                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" style={{ width: '180px', height: '180px' }} />
              ) : (
                <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#9ca3af' }}>
                  Loading QR...
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <div>Booking code: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{booking.bookingReference}</span></div>
            <div>Booking ID: {booking.id}</div>
          </div>
        </div>

        {/* Order details */}
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Order details</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div>
                <div style={{ fontWeight: '600' }}>Total bill ₹{totalAmount.toFixed(2)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Incl. taxes & fees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/bookings" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>View My Tickets</Link>
      </div>
    </div>
  );
}
