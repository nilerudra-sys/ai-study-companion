import React from 'react';

export default function TrainingProgress({ conceptsCount }) {
  const [videoWatched, setVideoWatched] = React.useState(false);
  
  return (
    <div className="pixel-box" style={{ marginBottom: '16px', backgroundColor: 'var(--retro-blue-light)', color: 'white' }}>
      <h3 style={{ fontSize: '12px', marginBottom: '16px', textShadow: '2px 2px 0 var(--retro-border)' }}>Session Progress</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Concepts Reviewed:</span>
          <span>{conceptsCount} / {conceptsCount}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Video Lesson:</span>
          <button 
            onClick={() => setVideoWatched(!videoWatched)}
            style={{ 
              backgroundColor: videoWatched ? 'var(--retro-green)' : 'var(--retro-red)', 
              border: '2px solid var(--retro-border)', 
              color: 'white', 
              fontSize: '8px', 
              padding: '4px',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P"'
            }}
          >
            {videoWatched ? 'Complete' : 'Mark Watched'}
          </button>
        </div>
      </div>
    </div>
  );
}
