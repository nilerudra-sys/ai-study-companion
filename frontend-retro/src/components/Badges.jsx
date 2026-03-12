import React from 'react';

export default function Badges({ playerState }) {
  const earnedBadges = playerState.badges || ['First Quiz Master'];
  
  const allBadges = [
    { title: 'First Quiz Master', desc: 'Completed your first quiz.', icon: '🎖️' },
    { title: 'Level 5 Novice', desc: 'Reached Level 5.', icon: '⭐' },
    { title: 'Concept Explorer', desc: 'Asked 10 questions.', icon: '🔍' },
    { title: 'Streak Champion', desc: 'Studied 5 days in a row.', icon: '🔥' },
    { title: 'AI Scholar', desc: 'Mastered all Intro nodes.', icon: '🎓' },
    { title: 'Bug Hunter', desc: 'Corrected a mistake.', icon: '🐛' }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--retro-red)', textShadow: '2px 2px 0px var(--retro-border)', marginBottom: '24px' }}>
        TROPHY CASE
      </h2>
      
      <div className="pixel-box" style={{ flex: 1, backgroundColor: 'var(--retro-bg-dark)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', alignContent: 'start', padding: '24px' }}>
        
        {allBadges.map((badge, idx) => {
          const isUnlocked = earnedBadges.includes(badge.title);
          
          return (
            <div 
              key={idx} 
              className="dialog-box"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                padding: '16px',
                opacity: isUnlocked ? 1 : 0.6,
                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                cursor: 'default',
                position: 'relative',
                minHeight: '140px'
              }}
            >
              <div 
                style={{ 
                  fontSize: '48px', 
                  marginBottom: '12px',
                  textShadow: isUnlocked ? '2px 2px 0px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {isUnlocked ? badge.icon : '❓'}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', color: isUnlocked ? 'var(--retro-text)' : '#888' }}>
                {isUnlocked ? badge.title : 'LOCKED'}
              </div>
              {isUnlocked && (
                <div style={{ fontSize: '8px', color: 'var(--retro-blue)', lineHeight: '1.4' }}>
                  {badge.desc}
                </div>
              )}
            </div>
          );
        })}
        
      </div>
    </div>
  );
}
