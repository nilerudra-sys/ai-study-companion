import React from 'react';

export default function TrainerCard({ trainer, onClick }) {
  return (
    <button 
      className="pixel-box dashboard-action-card" 
      onClick={() => onClick(trainer)}
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '8px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>{trainer.sprite}</div>
      <div style={{ fontSize: '12px', color: 'var(--retro-red)', fontWeight: 'bold' }}>{trainer.name}</div>
      
      <div style={{ fontSize: '8px', color: 'var(--retro-text)', marginTop: '12px', lineHeight: '1.8' }}>
        <div>Specialty:</div>
        <div style={{ color: 'var(--retro-blue)', marginTop: '4px' }}>{trainer.topic}</div>
      </div>
      
      <div style={{ fontSize: '8px', color: 'var(--retro-text)', marginTop: '12px', lineHeight: '1.8' }}>
        <div>Difficulty:</div>
        <div style={{ color: 'var(--retro-orange)', marginTop: '4px' }}>{trainer.difficulty}</div>
      </div>
    </button>
  );
}
