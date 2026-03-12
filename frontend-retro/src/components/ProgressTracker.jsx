import React from 'react';

export default function ProgressTracker({ xpEarned, topicsCompleted, totalTopics }) {
  return (
    <div className="pixel-box" style={{ 
      position: 'absolute', 
      top: '16px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      zIndex: 100,
      width: '90%',
      maxWidth: '400px',
      padding: '8px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backgroundColor: 'rgba(248, 248, 216, 0.95)' // Slightly transparent panel
    }}>
      <div style={{ textAlign: 'center', color: 'var(--retro-blue)', fontSize: '10px', textShadow: '1px 1px 0 #fff' }}>
        WORLD PROGRESS
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
        <span>XP Earned:</span>
        <span style={{ color: 'var(--retro-red)' }}>{xpEarned}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
        <span>Topics Completed:</span>
        <span style={{ color: 'var(--retro-green)' }}>{topicsCompleted} / {totalTopics}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
        <span>Next Unlock:</span>
        <span>{topicsCompleted < totalTopics ? '1 Level' : 'MAX'}</span>
      </div>
    </div>
  );
}
