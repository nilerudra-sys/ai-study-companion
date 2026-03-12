import React, { useContext } from 'react';
import { User, Coins, Shield, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function TopHUD({ playerState }) {
  const { logout } = useContext(AuthContext);
  const { name, level, xp, coins, badges } = playerState;
  
  // Calculate XP percentage (e.g. 100 xp per level)
  const xpMax = level * 100;
  const xpPercent = Math.min(100, Math.max(0, (xp / xpMax) * 100));

  return (
    <div className="layout-top-hud">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="pixel-box" style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--retro-red-dark)', color: 'white', borderColor: 'white' }}>
          <User size={16} />
          <span>{name}</span>
        </div>
        <div>
          <div style={{ marginBottom: '4px' }}>LVL {level}</div>
          <div className="xp-bar-container" style={{ width: '150px' }}>
            <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }}></div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--retro-yellow)' }}>
          <Coins size={20} />
          <span>{coins}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
          {badges.map((badge, idx) => (
            <div key={idx} style={{ color: 'var(--retro-yellow)' }} title={badge}>
              <Shield size={20} />
            </div>
          ))}
        </div>

        <button 
          onClick={logout}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer', 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            fontSize: '10px'
          }}
          title="Logout"
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </div>
    </div>
  );
}
