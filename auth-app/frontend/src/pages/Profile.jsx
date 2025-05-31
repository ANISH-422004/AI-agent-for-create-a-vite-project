import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#181e1f', color: '#e6ffe6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#222', padding: 32, borderRadius: 12, boxShadow: '0 4px 32px #01442155', minWidth: 320 }}>
        <h2 style={{ color: '#20c997', marginBottom: 16 }}>Profile</h2>
        <div style={{ color: '#20c997', marginBottom: 12 }}>Username:</div>
        <div style={{ fontWeight: 'bold', marginBottom: 24 }}>{username}</div>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#20c997', color: '#181e1f', padding: 10, border: 0, borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Back to Dashboard</button>
      </div>
    </div>
  );
}
