import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDetails.css';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/events/public/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error("Failed to load event details", err));
  }, [id]);

  if (!event) return null;

  return (
    <div className="event-details-page">
      <div className="event-cover" style={{ backgroundImage: `linear-gradient(to bottom, transparent, var(--bg-color)), url(${event.coverImageUrl})` }}></div>
      <div className="container event-details-content">
        <h1 className="event-title">{event.name}</h1>
        <div className="event-meta-large">
          <span>{event.date} • {event.startTime}</span>
          <span>{event.venue.name}, {event.venue.location}</span>
        </div>
        <p className="event-description">{event.description}</p>
        
        <div className="booking-action">
          <div className="price-hint">From ₹250</div>
          <Link to={`/events/${id}/seats`} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
