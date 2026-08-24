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
      axios.get(`https://ticketbooking-ycov.onrender.com/api/events/public/${eventId}`)
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
  
  const [showPayment, setShowPayment] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !cardName) {
      setError("Please fill in all payment details.");
      return;
    }
    confirmBooking();
  };

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
      
      await axios.post('https://ticketbooking-ycov.onrender.com/api/bookings', {
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

        {!showPayment ? (
          <button className="btn btn-primary w-100" style={{ width: '100%' }} onClick={() => setShowPayment(true)}>
            Proceed to Payment
          </button>
        ) : (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Payment Details
            </h4>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name on Card</label>
                <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white' }} placeholder="John Doe" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Card Number</label>
                <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))} maxLength="19" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white' }} placeholder="0000 0000 0000 0000" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Expiry</label>
                  <input type="text" value={expiry} onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').replace(/^(\d{2})(\d)/g, '$1/$2'))} maxLength="5" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white' }} placeholder="MM/YY" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>CVV</label>
                  <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} maxLength="4" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white' }} placeholder="123" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ width: '100%', opacity: isProcessing ? 0.7 : 1 }} disabled={isProcessing}>
                {isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
