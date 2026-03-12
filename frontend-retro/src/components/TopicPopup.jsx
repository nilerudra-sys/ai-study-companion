import React from 'react';

export default function TopicPopup({ topic, onClose, onStartLearning, onPracticeQuiz }) {
  if (!topic) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="pixel-box" style={{ 
        width: '80%', 
        maxWidth: '350px', 
        backgroundColor: '#fff',
        position: 'relative',
        padding: '24px 16px'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '-10px', right: '-10px',
            backgroundColor: 'var(--retro-red)', color: 'white',
            border: '4px solid var(--retro-border)', borderRadius: '50%',
            width: '32px', height: '32px',
            fontFamily: '"Press Start 2P"', fontSize: '12px',
            cursor: 'pointer', zIndex: 10
          }}
        >
          X
        </button>

        <h3 style={{ margin: '0 0 16px', color: 'var(--retro-red)', fontSize: '14px', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>
          {topic.label}
        </h3>

        <div style={{ fontSize: '8px', lineHeight: '1.8', color: 'var(--retro-text)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--retro-blue)' }}>Difficulty:</span>
            <span>{topic.difficulty}</span>
          </div>

          <div style={{ color: 'var(--retro-blue)', marginBottom: '4px' }}>Concepts Covered:</div>
          <ul style={{ paddingLeft: '16px', margin: '0 0 16px', listStyleType: 'square' }}>
            {topic.concepts.map((concept, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{concept}</li>
            ))}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', backgroundColor: '#f0f0f0', padding: '4px' }}>
            <span style={{ color: 'var(--retro-blue)' }}>Gym Leader Challenge:</span>
            <span style={{ color: 'var(--retro-red)' }}>{topic.gymLeader}</span>
          </div>

          <div style={{ color: 'var(--retro-blue)', marginBottom: '4px' }}>Rewards:</div>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--retro-green)' }}>
            <span>+{topic.xpReward} XP</span>
            <span>+{topic.coinReward} Coins</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <button className="pixel-btn" onClick={() => onStartLearning(topic)} style={{ padding: '8px', fontSize: '10px' }}>
            Start Learning
          </button>
          <button className="pixel-btn blue" onClick={() => onPracticeQuiz(topic)} style={{ padding: '8px', fontSize: '10px' }}>
            Practice Quiz
          </button>
        </div>

      </div>
    </div>
  );
}
