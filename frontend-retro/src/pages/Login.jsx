import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import RetroBackground from '../components/RetroBackground';

export default function Login({ setAuthView }) {
  const { login } = useContext(AuthContext);
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
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

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
        <h1 style={{ color: 'var(--retro-red)', fontSize: '24px', marginBottom: '8px' }}>AI STUDY COMPANION</h1>
        <p style={{ color: 'var(--retro-blue)', fontSize: '10px', marginBottom: '32px' }}>AUTHENTICATION TERMINAL</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <div style={{ color: 'white', backgroundColor: 'var(--retro-red)', padding: '8px', fontSize: '10px' }}>{error}</div>}
          
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

          <button type="submit" className="pixel-btn blue" style={{ marginTop: '16px', padding: '16px' }} disabled={loading}>
            {loading ? 'CONNECTING...' : 'LOGIN'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '10px' }}>
          <p>NEW TRAINER?</p>
          <button 
            onClick={() => setAuthView('signup')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--retro-red)', 
              fontFamily: 'inherit', 
              textDecoration: 'underline', 
              cursor: 'pointer',
              marginTop: '8px',
              fontSize: '10px'
            }}
          >
            CREATE NEW ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}
