import React from 'react';

export default function BattleConfirmModal({ trainer, onConfirm, onCancel }) {
  if (!trainer) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="dialog-box" style={{ width: '80%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{trainer.sprite}</div>
        
        <p style={{ fontSize: '12px', lineHeight: '1.6', marginBottom: '24px' }}>
          Do you want to battle <span style={{ color: 'var(--retro-red)' }}>{trainer.name}</span>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button className="pixel-btn" onClick={() => onConfirm(trainer)}>
            YES - BATTLE
          </button>
          <button className="pixel-btn blue" onClick={onCancel}>
            NO - CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
