import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (!authData) {
      navigate('/login');
    } else {
      setAuth(authData);
    }
  }, [navigate]);

  if (!auth) return null;

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px', margin: '0 auto', marginTop: '5vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>My Profile</h2>
      
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {auth.name ? auth.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{auth.name}</h3>
            <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {auth.role}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email Address</label>
            <div style={{ fontSize: '1.1rem' }}>{auth.email}</div>
          </div>
          
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Account ID</label>
            <div style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>{auth.id}</div>
          </div>
        </div>

        <button 
          onClick={() => {
            localStorage.removeItem('auth');
            window.dispatchEvent(new Event('storage'));
            navigate('/');
          }} 
          className="btn" 
          style={{ width: '100%', marginTop: '1rem', border: '1px solid #ff4d4f', color: '#ff4d4f', backgroundColor: 'transparent' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
