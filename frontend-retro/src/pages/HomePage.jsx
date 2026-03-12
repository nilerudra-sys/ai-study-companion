import React from 'react';
import RetroBackground from '../components/RetroBackground';

export default function HomePage({ onStartLearning }) {
  return (
    <div className="homepage-container">
      <RetroBackground />
      
      <div className="homepage-content">
        <h1 className="homepage-title">
          <span>AI STUDY</span>
          <span>COMPANION</span>
        </h1>
        
        <p className="homepage-subtitle">
          Learn like a Pokémon trainer. <br className="mobile-break" />
          Level up your knowledge.
        </p>

        <button 
          className="pixel-btn blue start-learning-btn" 
          onClick={onStartLearning}
        >
          START LEARNING ►
        </button>
      </div>
    </div>
  );
}
