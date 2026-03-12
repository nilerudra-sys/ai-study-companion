import React from 'react';
import TopicBadge from '../components/TopicBadge';

export default function Profile({ playerState, setView }) {
  // Hardcoded topics for the prototype demo to show completed vs incomplete
  const topics = [
    { name: 'Machine Learning', icon: '🤖', isCompleted: true },
    { name: 'Data Structures', icon: '🧱', isCompleted: playerState.level > 1 },
    { name: 'Algorithms', icon: '🧩', isCompleted: playerState.level > 2 },
    { name: 'Neural Networks', icon: '🧠', isCompleted: playerState.level > 3 },
    { name: 'Databases', icon: '💾', isCompleted: false },
    { name: 'Operating Systems', icon: '🖥️', isCompleted: false },
  ];

  // Formatting Trainer ID with leading zeros
  const formattedId = String(playerState.coins * 13 + 5780).padStart(5, '0');

  // Pokémon FireRed Trainer Card style
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* The Physical Card Border */}
      <div style={{
        backgroundColor: 'var(--retro-bg-light)',
        border: '6px solid var(--retro-border)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '8px 8px 0px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Red Header Bar */}
        <div style={{
          backgroundColor: 'var(--retro-red)',
          borderBottom: '4px solid var(--retro-border)',
          margin: '-16px -16px 16px -16px',
          padding: '16px',
          color: 'white',
          fontSize: '16px',
          textShadow: '2px 2px 0 var(--retro-border)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>TRAINER CARD</span>
          <span>★ {playerState.level}</span>
        </div>

        {/* Card Body Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Side: Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--retro-blue)' }}>IDNo.</span>
              <span style={{ fontSize: '12px' }}>{formattedId}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--retro-blue)' }}>NAME</span>
              <span style={{ fontSize: '12px', color: 'var(--retro-red)' }}>{playerState.name.toUpperCase()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--retro-blue)' }}>MONEY</span>
              <span style={{ fontSize: '12px' }}>${playerState.coins}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--retro-blue)' }}>TOTAL EXP</span>
              <span style={{ fontSize: '12px' }}>{playerState.xp}</span>
            </div>
          </div>

          {/* Right Side: Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', border: '4px solid #b8d8e8', backgroundColor: '#d8f0f8', borderRadius: '4px', height: '160px', position: 'relative', overflow: 'hidden' }}>
            <img 
              src="/trainer.png" 
              alt="Trainer Avatar" 
              style={{
                height: '140px',
                objectFit: 'contain',
                filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))'
              }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            {/* Fallback if image isn't loaded yet */}
            <div style={{ fontSize: '72px', marginBottom: '8px', animation: 'spark 3s infinite', display: 'none' }}>
              👦
            </div>
          </div>
        </div>

        {/* Badges / Topics Covered Area */}
        <div style={{
          backgroundColor: '#fff',
          border: '4px solid var(--retro-border)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <h3 style={{ fontSize: '10px', color: 'var(--retro-blue)', marginBottom: '16px', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>TOPICS MASTERED</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', justifyContent: 'center' }}>
            {topics.map((t, idx) => (
              <TopicBadge key={idx} topicName={t.name} isCompleted={t.isCompleted} icon={t.icon} />
            ))}
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button className="pixel-btn blue" onClick={() => setView('home')}>RETURN TO HUB</button>
      </div>

    </div>
  );
}
