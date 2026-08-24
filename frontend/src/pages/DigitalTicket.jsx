import { useSearchParams } from 'react-router-dom';

export default function DigitalTicket() {
  const [searchParams] = useSearchParams();
  const event = searchParams.get('event');
  const time = searchParams.get('time');
  const seats = searchParams.get('seats');
  const ref = searchParams.get('ref');

  if (!event || !ref) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Invalid Ticket</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This ticket link is invalid or corrupted.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '3rem',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, var(--accent-color), #8b5cf6)'
        }}></div>

        <h3 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>SHOWPASS TICKET</h3>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>{event}</h2>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>TIME</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{time || 'TBD'}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>SEATS</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--success)' }}>{seats}</span>
          </div>
        </div>

        <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>BOOKING REF</span>
          <span style={{ fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '2px' }}>{ref}</span>
        </div>
      </div>
    </div>
  );
}
