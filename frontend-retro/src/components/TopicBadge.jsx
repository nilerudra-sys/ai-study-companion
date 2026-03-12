import React from 'react';

export default function TopicBadge({ topicName, isCompleted, icon }) {
  const badgeStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    opacity: isCompleted ? 1 : 0.3,
    filter: isCompleted ? 'none' : 'grayscale(100%)',
    transition: 'all 0.3s ease'
  };

  const circleStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: isCompleted ? 'var(--retro-yellow)' : '#cccccc',
    border: '4px solid var(--retro-border)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
    boxShadow: isCompleted ? '0 0 10px var(--retro-orange)' : 'none'
  };

  return (
    <div style={badgeStyle} title={isCompleted ? `${topicName} Mastered!` : `${topicName} Not Started`}>
      <div style={circleStyle}>
        {icon}
      </div>
      <span style={{ fontSize: '8px', color: 'var(--retro-text)', textAlign: 'center', width: '60px' }}>
        {topicName}
      </span>
    </div>
  );
}
