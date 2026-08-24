import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [qrCodeData, setQrCodeData] = useState({}); // mapping booking id -> base64
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth) {
      navigate('/login');
      return;
    }
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    
    axios.get('https://ticketbooking-ycov.onrender.com/api/bookings', config)
      .then(res => {
        if (Array.isArray(res.data)) {
          setTickets(res.data);
        } else {
          console.error("Expected array of tickets but got:", res.data);
          setTickets([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch tickets", err);
        setTickets([]);
      });
  }, [navigate]);

  const handleViewQr = (bookingId) => {
    if (qrCodeData[bookingId]) {
      setQrCodeData(prev => ({ ...prev, [bookingId]: null })); // toggle off
      return;
    }
    const auth = JSON.parse(localStorage.getItem('auth'));
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    
    axios.get(`https://ticketbooking-ycov.onrender.com/api/bookings/${bookingId}/qr`, config)
      .then(res => {
        setQrCodeData(prev => ({ ...prev, [bookingId]: res.data }));
      })
      .catch(err => console.error("Failed to load QR", err));
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <h2 style={{ marginBottom: '3rem' }}>My Tickets</h2>
      
      {location.state?.showSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          Booking Confirmed! Your email notification and QR ticket have been sent.
        </div>
      )}

      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {tickets.map(ticket => (
          <div key={ticket.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div>
              <h3>{ticket.event.name}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>{ticket.event.date} • {ticket.event.startTime}</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{ticket.event.venue.name} • {ticket.seats ? ticket.seats.length : 0} Seats</p>
              <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>{ticket.status}</span>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-secondary" style={{ marginBottom: '1rem' }} onClick={() => handleViewQr(ticket.id)}>
                {qrCodeData[ticket.id] ? 'Hide Ticket QR' : 'View Ticket QR'}
              </button>
              {qrCodeData[ticket.id] && (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={`data:image/png;base64,${qrCodeData[ticket.id]}`} alt="Ticket QR" style={{ width: '150px', height: '150px' }} />
                </div>
              )}
              <br/>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ref: {ticket.bookingReference}</span>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>You don't have any tickets yet.</p>}
      </div>
    </div>
  );
}
