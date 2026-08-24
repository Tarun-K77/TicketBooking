import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      localStorage.setItem('auth', JSON.stringify(res.data));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      alert("Login failed! Please check your credentials.");
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
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign In</button>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <a href="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</a>
        </div>
      </form>
    </div>
  );
}
