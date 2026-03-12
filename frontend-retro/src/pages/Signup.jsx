import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import RetroBackground from '../components/RetroBackground';

export default function Signup({ setAuthView }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'}/auth`;
      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // Automatically login on successful signup
      login(data.user, data.token);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <RetroBackground />
      <div className="pixel-box" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'var(--retro-bg-light)',
        border: '6px solid var(--retro-border)',
        padding: '32px',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{ color: 'var(--retro-red)', fontSize: '20px', marginBottom: '8px' }}>NEW TRAINER</h1>
        <p style={{ color: 'var(--retro-blue)', fontSize: '10px', marginBottom: '32px' }}>BEGIN YOUR JOURNEY</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <div style={{ color: 'white', backgroundColor: 'var(--retro-red)', padding: '8px', fontSize: '10px' }}>{error}</div>}
          
          <input 
            type="text" 
            placeholder="Trainer Name" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ padding: '12px', fontFamily: 'inherit', fontSize: '12px', border: '2px solid var(--retro-border)', outline: 'none' }}
          />
          <input 
            type="email" 
            placeholder="Trainer Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: '12px', fontFamily: 'inherit', fontSize: '12px', border: '2px solid var(--retro-border)', outline: 'none' }}
          />
          <input 
            type="password" 
            placeholder="Secret Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: '12px', fontFamily: 'inherit', fontSize: '12px', border: '2px solid var(--retro-border)', outline: 'none' }}
          />

          <button type="submit" className="pixel-btn" style={{ marginTop: '16px', padding: '16px' }} disabled={loading}>
            {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '10px' }}>
          <p>ALREADY HAVE AN ID?</p>
          <button 
            onClick={() => setAuthView('login')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--retro-blue)', 
              fontFamily: 'inherit', 
              textDecoration: 'underline', 
              cursor: 'pointer',
              marginTop: '8px',
              fontSize: '10px'
            }}
          >
            RETURN TO LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
