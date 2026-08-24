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
  const [event, setEvent] = useState(null);
  
  useEffect(() => {
    // 0. Fetch event details
    axios.get(`https://ticketbooking-ycov.onrender.com/api/events/public/${id}`).then(res => setEvent(res.data));

    // 1. Fetch seats from backend
    axios.get(`https://ticketbooking-ycov.onrender.com/api/events/public/${id}/seats`).then(res => setSeats(res.data));

    // 2. Connect WebSocket
    const stompClient = new Client({
      brokerURL: 'wss://ticketbooking-ycov.onrender.com/ws',
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

  const [errorMsg, setErrorMsg] = useState("");

  const handleContinue = async () => {
    setErrorMsg("");
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      if (!auth) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      
      const holdIds = [];
      for (const s of selectedSeats) {
        const res = await axios.post('https://ticketbooking-ycov.onrender.com/api/holds', { eventSeatId: s.id }, config);
        holdIds.push(res.data.id);
      }
      navigate('/checkout', { state: { selectedSeats, eventId: id, holdIds } });
    } catch (e) {
      if (e.response && (e.response.status === 401 || e.response.status === 403 || e.response.data === "No value present")) {
        localStorage.removeItem('auth');
        navigate('/login');
        return;
      }
      setErrorMsg("Failed to hold seats. Some seats might have been booked.");
    }
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const isConcert = event && (event.type === 'CONCERT' || event.type === 'EVENT');

  const renderMovieLayout = () => {
    const rows = {};
    seats.forEach(s => {
      if (!rows[s.seat.row]) rows[s.seat.row] = [];
      rows[s.seat.row].push(s);
    });

    return (
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
    );
  };

  const renderConcertLayout = () => {
    const bays = { Platinum: [], Gold: [], Silver: [] };
    
    seats.forEach(s => {
      const cat = s.seat.category.name;
      if (bays[cat]) bays[cat].push(s);
    });

    return (
      <div className="seat-map-container concert-map-container">
        <div className="stage-indicator">STAGE</div>
        
        <div className="concert-bays">
          {Object.keys(bays).map(bayName => {
            if (bays[bayName].length === 0) return null;
            
            const bayRows = {};
            bays[bayName].forEach(s => {
              if (!bayRows[s.seat.row]) bayRows[s.seat.row] = [];
              bayRows[s.seat.row].push(s);
            });

            return (
              <div key={bayName} className={`concert-bay bay-${bayName.toLowerCase()}`}>
                <h4 className="bay-title">{bayName} Zone</h4>
                <div className="seat-grid">
                  {Object.keys(bayRows).sort().map(row => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      <div className="seats">
                        {bayRows[row].sort((a,b) => a.seat.number - b.seat.number).map(seat => (
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
              </div>
            );
          })}
        </div>

        <div className="seat-legend">
          <div className="legend-item"><span className="seat seat-available"></span> Available</div>
          <div className="legend-item"><span className="seat seat-selected"></span> Selected</div>
          <div className="legend-item"><span className="seat seat-held"></span> Held</div>
          <div className="legend-item"><span className="seat seat-booked"></span> Booked</div>
        </div>
      </div>
    );
  };

  return (
    <div className="seat-selection-page container">
      {isConcert ? renderConcertLayout() : renderMovieLayout()}

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
            {errorMsg && <div style={{ color: '#ff4d4f', marginTop: '10px', fontSize: '14px', textAlign: 'center', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '4px' }}>{errorMsg}</div>}
            <button className="btn btn-primary w-100" onClick={handleContinue} style={{ marginTop: '10px' }}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}
