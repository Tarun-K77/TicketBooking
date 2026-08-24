import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post('https://ticketbooking-ycov.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('auth', JSON.stringify(res.data));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      setErrorMsg("Login failed! Please check your credentials.");
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '400px', margin: '0 auto', marginTop: '10vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to SHOWPASS</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
        </div>
        {errorMsg && <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '4px' }}>{errorMsg}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign In</button>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <a href="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</a>
        </div>
      </form>
    </div>
  );
}
