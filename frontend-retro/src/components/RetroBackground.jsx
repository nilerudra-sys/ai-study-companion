import React from 'react';

export default function RetroBackground() {
  return (
    <div className="retro-background">
      {/* 
        Using a seamless looping pixel art background. 
        This adds the nostalgic FireRed feeling without being distracting.
      */}
      <div className="cloud clouds-1"></div>
      <div className="cloud clouds-2"></div>
      <div className="cloud clouds-3"></div>
      <div className="ground-layer"></div>
    </div>
  );
}
