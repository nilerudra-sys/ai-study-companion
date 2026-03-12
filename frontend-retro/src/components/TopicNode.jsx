import React from 'react';

export default function TopicNode({ node, onClick }) {
  return (
    <div 
      style={{ 
        position: 'absolute',
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: node.status !== 'locked' ? 'pointer' : 'not-allowed',
        opacity: node.status === 'locked' ? 0.6 : 1,
        zIndex: node.status === 'current' ? 50 : 10
      }}
      onClick={() => {
        if (node.status !== 'locked') onClick(node);
      }}
    >
      {/* Optional Trainer Icon sitting on top of the current node */}
      {node.status === 'current' && (
        <div style={{ 
          position: 'absolute', 
          top: '-32px', 
          fontSize: '24px', 
          animation: 'spark 1.5s infinite alternate',
          filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))'
        }}>
          🚶
        </div>
      )}

      {/* Node Circle */}
      <div 
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: node.status === 'completed' ? 'var(--retro-yellow)' : node.status === 'current' ? 'var(--retro-red)' : '#888',
          border: '4px solid var(--retro-border)',
          borderRadius: '50%',
          boxShadow: node.status === 'current' ? '0 0 15px var(--retro-red)' : '2px 2px 0px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: node.status === 'completed' ? 'var(--retro-border)' : 'white',
          transition: 'all 0.3s ease'
        }}
      >
        {node.status === 'completed' && '⭐'}
        {node.status === 'current' && 'G'}
        {node.status === 'locked' && '🔒'}
      </div>
      
      {/* Node Label Dialog */}
      <div 
        className="dialog-box" 
        style={{ 
          padding: '4px 8px', 
          fontSize: '8px', 
          marginTop: '8px', 
          whiteSpace: 'nowrap',
          borderWidth: '2px', // Override standard 4px for smaller label
          boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
        }}
      >
        {node.label}
      </div>
    </div>
  );
}
