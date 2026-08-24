import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post('https://ticketbooking-ycov.onrender.com/api/auth/register', { name, email, password, role: 'CUSTOMER' });
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrorMsg("Registration failed! Email might be in use.");
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '400px', margin: '0 auto', marginTop: '10vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
        </div>
        {errorMsg && <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '4px' }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: '#52c41a', marginBottom: '15px', textAlign: 'center', backgroundColor: 'rgba(82, 196, 26, 0.1)', padding: '10px', borderRadius: '4px' }}>{successMsg}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
      </form>
    </div>
  );
}
