import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    axios.get('https://ticketbooking-ycov.onrender.com/api/events/public')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to load events", err));
  }, []);

  let displayEvents = events;
  if (categoryFilter) {
    displayEvents = events.filter(e => e.type === categoryFilter);
  }

  const movies = displayEvents.filter(e => e.type === 'MOVIE');
  const concerts = displayEvents.filter(e => e.type === 'CONCERT');
  const otherEvents = displayEvents.filter(e => e.type !== 'MOVIE' && e.type !== 'CONCERT');
  const featured = !categoryFilter && events.length > 0 ? events[0] : null;

  return (
    <div className="home-page" style={{ paddingBottom: '4rem' }}>
      {featured && (
        <div className="hero-section" style={{ backgroundImage: `linear-gradient(to right, var(--bg-color) 10%, transparent 60%, var(--bg-color)), linear-gradient(to bottom, transparent 50%, var(--bg-color)), url(${featured.coverImageUrl})` }}>
          <div className="container hero-content">
            <span className="badge">Featured</span>
            <h1 className="hero-title">{featured.name}</h1>
            <p className="hero-desc">{featured.description}</p>
            <div className="hero-meta">
              <span>{featured.date}</span>
              <span>{featured.venue.name}</span>
            </div>
            <Link to={`/events/${featured.id}`} className="btn btn-primary" style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }}>Book Now</Link>
          </div>
        </div>
      )}

      {/* Movies Section */}
      {movies.length > 0 && (
        <section className="container discovery-section">
          <h2 className="section-title">Trending Movies</h2>
          <div className="events-grid">
            {movies.map(event => (
              <Link to={`/events/${event.id}`} key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.coverImageUrl} alt={event.name} />
                </div>
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <span>{event.date}</span>
                    <span>{event.venue.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Concerts Section */}
      {concerts.length > 0 && (
        <section className="container discovery-section">
          <h2 className="section-title">Upcoming Concerts</h2>
          <div className="events-grid">
            {concerts.map(event => (
              <Link to={`/events/${event.id}`} key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.coverImageUrl} alt={event.name} />
                </div>
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <span>{event.date}</span>
                    <span>{event.venue.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Events Section */}
      {otherEvents.length > 0 && (
        <section className="container discovery-section">
          <h2 className="section-title">Other Events</h2>
          <div className="events-grid">
            {otherEvents.map(event => (
              <Link to={`/events/${event.id}`} key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.coverImageUrl} alt={event.name} />
                </div>
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <span>{event.date}</span>
                    <span>{event.venue.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
