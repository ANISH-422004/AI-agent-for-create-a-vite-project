import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#181e1f', color: '#e6ffe6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#222', padding: 32, borderRadius: 12, boxShadow: '0 4px 32px #01442155', minWidth: 340, textAlign: 'center' }}>
        <h2 style={{ color: '#20c997', marginBottom: 12 }}>Dashboard</h2>
        <p style={{ marginBottom: 24 }}>Welcome, <span style={{ color: '#20c997', fontWeight: 'bold' }}>{username}</span>!</p>
        <button onClick={handleLogout} style={{ width: '100%', background: '#d13333', color: '#fff', padding: 10, border: 0, borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        <p style={{ marginTop: 24 }}><span style={{ color: '#20c997', cursor: 'pointer' }} onClick={() => navigate('/profile')}>View Profile</span></p>
      </div>
    </div>
  );
}
