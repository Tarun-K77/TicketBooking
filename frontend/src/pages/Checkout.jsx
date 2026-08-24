import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, eventId } = location.state || { selectedSeats: [] };
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (selectedSeats.length === 0) navigate('/');
    
    if (eventId) {
      axios.get(`http://localhost:8080/api/events/public/${eventId}`)
        .then(res => setEvent(res.data))
        .catch(err => console.error("Failed to load event for checkout", err));
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/events/${eventId}/seats`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedSeats, navigate, eventId]);

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const confirmBooking = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError('');
    
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      if (!auth) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      
      await axios.post('http://localhost:8080/api/bookings', {
        eventId: eventId,
        holdIds: location.state?.holdIds || []
      }, config);
      
      navigate('/bookings', { state: { showSuccess: true } });
    } catch (e) {
      setError('Booking failed. Your holds may have expired or the database is busy. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Seats reserved for you</p>
        <h2 style={{ fontSize: '3rem', color: 'var(--accent-color)' }}>{formatTime(timeLeft)}</h2>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '2rem' }}>Checkout</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Event</p>
          <h4>{event ? event.name : 'Loading...'}</h4>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Seats</p>
          <h4>{selectedSeats.map(s => `${s.seat.row}${s.seat.number}`).join(', ')}</h4>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{totalAmount}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 60, 60, 0.1)', color: '#ff4d4d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255, 60, 60, 0.2)' }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary w-100" style={{ width: '100%', opacity: isProcessing ? 0.7 : 1 }} onClick={confirmBooking} disabled={isProcessing}>
          {isProcessing ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
