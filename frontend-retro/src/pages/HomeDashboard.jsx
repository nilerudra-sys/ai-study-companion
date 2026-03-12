import React from 'react';

export default function HomeDashboard({ setView, playerState }) {
  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      
      {/* 1. Welcome Section */}
      <div className="pixel-box" style={{ backgroundColor: 'var(--retro-bg-dark)', color: 'white' }}>
        <h1 style={{ color: 'var(--retro-yellow)', marginBottom: '16px', fontSize: '20px' }}>Welcome back, Trainer!</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>NAME: {playerState.name}</div>
          <div>LEVEL: {playerState.level}</div>
          <div>
            XP: {playerState.xp} / {playerState.level * 100}
            <div className="xp-bar-container">
              <div 
                className="xp-bar-fill" 
                style={{ width: `${Math.min(100, (playerState.xp / (playerState.level * 100)) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div style={{ color: 'var(--retro-yellow)' }}>COINS: {playerState.coins} 💰</div>
        </div>
      </div>

      {/* 2 & 4 & 5. Middle Section (Progress, Continue, Daily) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Learning Progress Cards */}
        <div className="pixel-box" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ color: 'var(--retro-blue)', fontSize: '14px' }}>TRAINER STATS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '10px' }}>
            <div className="dialog-box" style={{ padding: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--retro-red)', marginBottom: '4px' }}>TOTAL XP</div>
              <div>{playerState.xp}</div>
            </div>
            <div className="dialog-box" style={{ padding: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--retro-red)', marginBottom: '4px' }}>LEVEL</div>
              <div>{playerState.level}</div>
            </div>
            <div className="dialog-box" style={{ padding: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--retro-red)', marginBottom: '4px' }}>BADGES</div>
              <div>{playerState.badges.length || 0}</div>
            </div>
            <div className="dialog-box" style={{ padding: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--retro-red)', marginBottom: '4px' }}>TOPICS</div>
              <div>3</div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="pixel-box" style={{ border: '4px solid var(--retro-red-dark)' }}>
          <h2 style={{ color: 'var(--retro-red)', fontSize: '14px', marginBottom: '16px' }}>CONTINUE JOURNEY</h2>
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>Lvl 2: Neural Networks</div>
          <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Progress: 40%</div>
          <div className="xp-bar-container" style={{ marginBottom: '16px' }}>
            <div className="xp-bar-fill" style={{ width: '40%', backgroundColor: 'var(--retro-red)' }}></div>
          </div>
          <button className="pixel-btn blue" style={{ width: '100%' }} onClick={() => setView('quiz')}>
            RESUME ►
          </button>
        </div>

        {/* Daily Challenge */}
        <div className="pixel-box" style={{ backgroundColor: '#fffbe6' }}>
          <h2 style={{ color: 'var(--retro-orange)', fontSize: '14px', marginBottom: '16px' }}>DAILY CHALLENGE ⚡</h2>
          <div style={{ fontSize: '10px', lineHeight: '1.6', marginBottom: '16px' }}>
            Complete a "Machine Learning Basics" Quiz Battle without missing a question!
          </div>
          <div style={{ color: 'var(--retro-green)', fontSize: '10px', marginBottom: '16px' }}>
            REWARD: +50 XP | +20 COINS
          </div>
          <button className="pixel-btn" style={{ width: '100%', backgroundColor: 'var(--retro-orange)', borderColor: '#c06020' }} onClick={() => setView('quiz')}>
            ACCEPT CHALLENGE
          </button>
        </div>

      </div>

      {/* 3. Main Action Cards */}
      <div>
        <h2 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--retro-text)' }}>QUICK ACTIONS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          <button className="dashboard-action-card" onClick={() => setView('trainer-arena')} style={{ border: '4px solid var(--retro-red)', color: 'var(--retro-red)' }}>
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>💥</span>
            <span>EXPERT MODE<br/>Gym Leader Boss</span>
          </button>

          <button className="dashboard-action-card" onClick={() => setView('chat')}>
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>💬</span>
            <span>Ask AI Tutor</span>
          </button>
          
          <button className="dashboard-action-card" onClick={() => setView('quiz')}>
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>⚔️</span>
            <span>Quiz Battle</span>
          </button>
          
          <button className="dashboard-action-card" onClick={() => setView('map')}>
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</span>
            <span>Progress Map</span>
          </button>
          
          <button className="dashboard-action-card" onClick={() => setView('badges')}>
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</span>
            <span>Badges</span>
          </button>

        </div>
      </div>

    </div>
  );
}
