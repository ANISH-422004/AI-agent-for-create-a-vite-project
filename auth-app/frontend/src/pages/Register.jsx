import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#181e1f', color: '#e6ffe6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#222', padding: 32, borderRadius: 12, boxShadow: '0 4px 32px #01442155', minWidth: 320 }}>
        <h2 style={{ color: '#20c997', marginBottom: 16 }}>Register</h2>
        <input type="text" placeholder="Username"
          style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #20c997', borderRadius: 4, background: '#161a1d', color: '#e6ffe6' }}
          value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password"
          style={{ width: '100%', padding: 8, marginBottom: 18, border: '1px solid #20c997', borderRadius: 4, background: '#161a1d', color: '#e6ffe6' }}
          value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div style={{ color: '#d13333', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: '#20c997', marginBottom: 12 }}>{success}</div>}
        <button type="submit" style={{ width: '100%', background: '#20c997', color: '#181e1f', padding: 10, border: 0, borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Register</button>
        <p style={{ marginTop: 16, color: '#adf7b6' }}>Already have an account? <span style={{ color: '#20c997', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span></p>
      </form>
    </div>
  );
}
