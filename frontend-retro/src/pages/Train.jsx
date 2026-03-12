import React from 'react';
import ConceptSection from '../components/ConceptSection';
import VideoSection from '../components/VideoSection';
import TrainingProgress from '../components/TrainingProgress';

export default function Train({ selectedTopicForTrain, setView, setExpertTrainer }) {
  if (!selectedTopicForTrain) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: 'var(--retro-red)' }}>NO TOPIC SELECTED</h2>
        <button className="pixel-btn blue" onClick={() => setView('map')} style={{ marginTop: '20px' }}>
          RETURN TO MAP
        </button>
      </div>
    );
  }

  // Map dummy video links to topics for the prototype
  const getDummyVideo = (label) => {
    switch (label) {
      case 'Intro to AI': return "https://www.youtube.com/embed/2ePf9rue1Ao"; // Example AI video
      case 'Machine Learning': return "https://www.youtube.com/embed/ukzFI9rgwfU"; // Example ML video
      case 'Neural Networks': return "https://www.youtube.com/embed/aircAruvnKk"; // Example NN video
      default: return "https://www.youtube.com/embed/WXuK6gekU1Y"; // Fallback generic video
    }
  };

  const videoUrl = getDummyVideo(selectedTopicForTrain.label);

  const handlePracticeQuiz = () => {
    setView('quiz');
  };

  const handleAskTutor = () => {
    setView('chat');
  };

  const handleChallengeGym = () => {
    // Prep the Gym battle with the current topic
    const trainer = {
      name: selectedTopicForTrain.gymLeader,
      topic: selectedTopicForTrain.label,
      difficulty: selectedTopicForTrain.difficulty === '⭐⭐⭐⭐⭐' ? 'Master' : 'Expert',
      sprite: '👾' // fallback sprite
    };
    setExpertTrainer(trainer);
    setView('gym-leader');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--retro-blue)', textShadow: '2px 2px 0 #fff', marginBottom: '24px', textAlign: 'center' }}>
        TRAINING AREA
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        
        {/* Top/Main Details */}
        <ConceptSection topic={selectedTopicForTrain} />

        {/* Video Embed */}
        <VideoSection videoUrl={videoUrl} videoTitle={`${selectedTopicForTrain.label} Lesson`} />

        {/* Progress Tracker Widget */}
        <TrainingProgress conceptsCount={selectedTopicForTrain.concepts ? selectedTopicForTrain.concepts.length : 0} />

        {/* Action Buttons */}
        <div style={{ 
          backgroundColor: 'var(--retro-bg-light)', 
          border: '4px solid var(--retro-border)', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          marginTop: '16px'
        }}>
          <h3 style={{ fontSize: '12px', color: 'var(--retro-text)', marginBottom: '8px', textAlign: 'center' }}>
            Next Available Actions:
          </h3>
          
          <button className="pixel-btn blue" onClick={handlePracticeQuiz}>
            📝 PRACTICE QUIZ
          </button>
          
          <button className="pixel-btn" style={{ backgroundColor: 'var(--retro-green)' }} onClick={handleAskTutor}>
            💬 ASK AI TUTOR
          </button>
          
          <button className="pixel-btn" style={{ backgroundColor: 'var(--retro-red)' }} onClick={handleChallengeGym}>
            💥 CHALLENGE GYM LEADER
          </button>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
        <button className="pixel-btn" style={{ backgroundColor: '#888' }} onClick={() => setView('map')}>
          RETURN TO WORLD MAP
        </button>
      </div>
    </div>
  );
}
