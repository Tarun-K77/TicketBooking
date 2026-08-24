import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './SeatSelection.css';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  useEffect(() => {
    // 1. Fetch seats from backend
    axios.get(`http://localhost:8080/api/events/public/${id}/seats`).then(res => setSeats(res.data));

    // 2. Connect WebSocket
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        stompClient.subscribe(`/topic/events/${id}/seats`, (message) => {
          const update = JSON.parse(message.body);
          setSeats(prev => prev.map(s => s.id === update.eventSeatId ? { ...s, status: update.status } : s));
        });
      }
    });
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [id]);

  const toggleSeat = (seat) => {
    if (seat.status !== 'AVAILABLE' && seat.status !== 'SELECTED') return;
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      setSeats(prev => prev.map(s => s.id === seat.id ? { ...s, status: 'AVAILABLE' } : s));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
      setSeats(prev => prev.map(s => s.id === seat.id ? { ...s, status: 'SELECTED' } : s));
    }
  };

  const handleContinue = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      if (!auth) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      
      const holdIds = [];
      for (const s of selectedSeats) {
        const res = await axios.post('http://localhost:8080/api/holds', { eventSeatId: s.id }, config);
        holdIds.push(res.data.id);
      }
      navigate('/checkout', { state: { selectedSeats, eventId: id, holdIds } });
    } catch (e) {
      alert("Failed to hold seats. Some seats might have been booked.");
    }
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  // Group seats by row
  const rows = {};
  seats.forEach(s => {
    if (!rows[s.seat.row]) rows[s.seat.row] = [];
    rows[s.seat.row].push(s);
  });

  return (
    <div className="seat-selection-page container">
      <div className="seat-map-container">
        <div className="screen-indicator">SCREEN</div>
        
        <div className="seat-grid">
          {Object.keys(rows).sort().map(row => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              <div className="seats">
                {rows[row].sort((a,b) => a.seat.number - b.seat.number).map(seat => (
                  <button 
                    key={seat.id}
                    className={`seat seat-${seat.status.toLowerCase()}`}
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.status === 'BOOKED' || seat.status === 'HELD'}
                  ></button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="seat-legend">
          <div className="legend-item"><span className="seat seat-available"></span> Available</div>
          <div className="legend-item"><span className="seat seat-selected"></span> Selected</div>
          <div className="legend-item"><span className="seat seat-held"></span> Held</div>
          <div className="legend-item"><span className="seat seat-booked"></span> Booked</div>
        </div>
      </div>

      <div className="booking-summary-sidebar">
        <h3>Selected Seats</h3>
        {selectedSeats.length === 0 ? (
          <p className="empty-selection">No seats selected</p>
        ) : (
          <div className="selected-list">
            <p className="seat-numbers">
              {selectedSeats.map(s => `${s.seat.row}${s.seat.number}`).join(', ')}
            </p>
            <div className="price-breakdown">
              {selectedSeats.map(s => (
                <div key={s.id} className="price-row">
                  <span>{s.seat.category.name}</span>
                  <span>₹{s.price}</span>
                </div>
              ))}
            </div>
            <div className="total-row">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <button className="btn btn-primary w-100" onClick={handleContinue}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}
