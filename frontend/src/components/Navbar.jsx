import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')));

  useEffect(() => {
    const handleStorage = () => setAuth(JSON.parse(localStorage.getItem('auth')));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">SHOWPASS</Link>
        
        <nav className="nav-links">
          <Link to="/?category=MOVIE" className="nav-link">Movies</Link>
          <Link to="/?category=EVENT" className="nav-link">Events</Link>
          <Link to="/?category=CONCERT" className="nav-link">Concerts</Link>
          {auth ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/bookings" className="nav-link">My Tickets</Link>
              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', borderRadius: '4px' }}>Sign Up</Link>
            </div>
          )}
        </nav>

        <div className="nav-links">
          <button className="nav-link" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Search size={18} /> Search
          </button>
        </div>
      </div>
    </header>
  );
}
