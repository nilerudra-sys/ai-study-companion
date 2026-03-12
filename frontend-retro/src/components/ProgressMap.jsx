import React, { useState } from 'react';
import ProgressTracker from './ProgressTracker';
import TopicNode from './TopicNode';
import TopicPopup from './TopicPopup';
import { mapTopics } from '../data/mapTopics';

export default function ProgressMap({ setView, playerState, setSelectedTopicForTrain }) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const mapNodes = mapTopics;

  // Derive metrics
  const topicsCompleted = mapNodes.filter(n => n.status === 'completed').length;
  const totalTopics = mapNodes.length;
  const xpEarned = playerState ? playerState.xp : topicsCompleted * 75; // fallback

  const handleNodeClick = (node) => {
    setSelectedTopic(node);
  };

  const closePopup = () => {
    setSelectedTopic(null);
  };

  const handleStartLearning = (topic) => {
    // Pass the selected topic data up to the App so Train.jsx can use it
    setSelectedTopicForTrain(topic);
    // Route to the detailed Train visual view
    setView('train');
  };

  const handlePracticeQuiz = (topic) => {
    // Go to quiz battle
    setView('quiz');
  };

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--retro-blue-light)', textShadow: '2px 2px 0px var(--retro-border)', marginBottom: '8px' }}>
        WORLD MAP
      </h2>
      
      <div className="pixel-box" style={{ width: '100%', height: 'calc(100% - 40px)', position: 'relative', backgroundColor: '#a0e0a0', overflow: 'hidden', padding: 0 }}>
        
        {/* Top HUD for Map */}
        <ProgressTracker xpEarned={xpEarned} topicsCompleted={topicsCompleted} totalTopics={totalTopics} />

        {/* Draw paths between nodes */}
        {/* We highlight paths that connect to completed nodes */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          {/* Base dashed path */}
          <path d="M 20% 20% L 50% 50% L 80% 30% L 80% 80% L 50% 90%" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="6" strokeDasharray="8 8" />
          
          {/* Highlight completed path (manually drawn for demo) */}
          <path d="M 20% 20% L 50% 50% L 80% 30%" fill="none" stroke="var(--retro-yellow)" strokeWidth="4" />
        </svg>

        {/* Draw interactive nodes over the SVG */}
        {mapNodes.map(node => (
          <TopicNode 
            key={node.id} 
            node={node} 
            onClick={handleNodeClick} 
          />
        ))}

      </div>

      {/* Render Popup Card if a node is selected */}
      <TopicPopup 
        topic={selectedTopic} 
        onClose={closePopup} 
        onStartLearning={handleStartLearning}
        onPracticeQuiz={handlePracticeQuiz}
      />

    </div>
  );
}
