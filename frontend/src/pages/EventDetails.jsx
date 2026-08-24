import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDetails.css';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`https://ticketbooking-ycov.onrender.com/api/events/public/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error("Failed to load event details", err));
  }, [id]);

  if (!event) return null;

  return (
    <div className="event-details-page">
      <div style={{ position: 'relative' }}>
        <div className="event-cover" style={{ 
          backgroundImage: `linear-gradient(to right, rgba(13,13,15,1) 0%, rgba(13,13,15,0.7) 50%, rgba(13,13,15,1) 100%), url(${event.coverImageUrl})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)', 
          transform: 'scale(1.05)',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0
        }}></div>
        
        <div className="container event-details-content" style={{ 
          position: 'relative', 
          zIndex: 1, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '6rem',
          paddingBottom: '4rem',
          gap: '4rem'
        }}>
          
          <div style={{ flex: 1, maxWidth: '650px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-1px' }}>{event.name}</h1>
            
            <div style={{ fontSize: '1rem', color: '#ccc', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>{event.type === 'MOVIE' ? 'UA16+' : 'All Ages'}</span>
              <span>|</span>
              <span>English / Regional</span>
              <span>|</span>
              <span>{event.type === 'MOVIE' ? '2h 45m' : '3h 00m'}</span>
            </div>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e5e5e5', marginBottom: '2rem' }}>
              {event.description}
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.875rem' }}>{event.type === 'MOVIE' ? 'Drama' : 'Live'}</span>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.875rem' }}>{event.type === 'MOVIE' ? 'Action' : 'Music'}</span>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.875rem' }}>{event.type === 'MOVIE' ? 'Thriller' : 'Experience'}</span>
            </div>
            
            <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Scheduled for {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            <div>
              <Link to={`/events/${id}/seats`} className="btn" style={{ 
                padding: '1rem 5rem', 
                fontSize: '1.125rem', 
                backgroundColor: '#fff', 
                color: '#000', 
                fontWeight: '600', 
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                Book Tickets
              </Link>
            </div>
          </div>

          <div className="event-poster-wrapper">
            <img src={event.coverImageUrl} alt={event.name} style={{ 
              width: '320px', 
              height: '480px', 
              objectFit: 'cover', 
              borderRadius: '12px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', 
              flexShrink: 0 
            }} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', padding: '4rem 0', minHeight: '400px' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Cast & Crew</h2>
          <div style={{ display: 'flex', gap: '3rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {event.artists && event.artists.map(artist => (
              <div key={artist.id} style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden'
                }}>
                  {artist.imageUrl ? (
                    <img src={artist.imageUrl} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <svg width="40" height="40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{artist.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{artist.role}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '4rem 0 2rem 0' }}>About the Venue</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {event.venue.name} - {event.venue.location}
          </p>
        </div>
      </div>
    </div>
  );
}
