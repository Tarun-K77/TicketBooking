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
              <Link to="/profile" className="nav-link">My Profile</Link>
              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', borderRadius: '4px' }}>Sign Up</Link>
            </div>
          )}
        </nav>

        <form className="nav-links" onSubmit={(e) => {
          e.preventDefault();
          const query = e.target.search.value;
          if (query) navigate(`/?search=${encodeURIComponent(query)}`);
          else navigate('/');
        }} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '0.2rem 1rem' }}>
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input name="search" type="text" placeholder="Search events..." style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.5rem', outline: 'none', width: '150px' }} />
        </form>
      </div>
    </header>
  );
}
