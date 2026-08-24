import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', { name, email, password, role: 'CUSTOMER' });
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Registration failed! Email might be in use.");
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
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
      </form>
    </div>
  );
}
