import React, { useState } from 'react';
import TrainerCard from '../components/TrainerCard';
import BattleConfirmModal from '../components/BattleConfirmModal';

export default function TrainerArena({ setView, setExpertTrainer }) {
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // Hardcoded Trainers for the Demo
  const trainers = [
    {
      id: 1,
      name: "ML Expert",
      topic: "Machine Learning",
      difficulty: "Expert",
      sprite: "🤖"
    },
    {
      id: 2,
      name: "Data Structures Master",
      topic: "Data Structures",
      difficulty: "Expert",
      sprite: "🧱"
    },
    {
      id: 3,
      name: "Algorithms Strategist",
      topic: "Algorithms",
      difficulty: "Hard",
      sprite: "🧩"
    },
    {
      id: 4,
      name: "Neural Nets Champion",
      topic: "Neural Networks",
      difficulty: "Master",
      sprite: "🧠"
    }
  ];

  const handleTrainerClick = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleConfirmBattle = (trainer) => {
    // 1. Save the selected trainer into App state so GymLeaderBattle has it
    setExpertTrainer(trainer);
    // 2. Clear Modal
    setSelectedTrainer(null);
    // 3. Route to the actual battle interface
    setView('gym-leader');
  };

  const handleCancelBattle = () => {
    setSelectedTrainer(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--retro-red)', textShadow: '2px 2px 0 #fff' }}>TRAINER ARENA</h2>
      <p style={{ fontSize: '12px', lineHeight: '1.6', marginBottom: '32px' }}>
        Select an Expert Trainer to challenge them to a Gym Battle! <br/>
        Each trainer specializes in a different domain of Computer Science.
      </p>

      {/* 2x2 Grid using CSS Grid via inline styles for simplicity */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        padding: '16px'
      }}>
        {trainers.map(trainer => (
          <TrainerCard 
            key={trainer.id} 
            trainer={trainer} 
            onClick={handleTrainerClick} 
          />
        ))}
      </div>

      <BattleConfirmModal 
        trainer={selectedTrainer} 
        onConfirm={handleConfirmBattle} 
        onCancel={handleCancelBattle} 
      />
      
      <button 
        className="pixel-btn blue" 
        onClick={() => setView('home')} 
        style={{ marginTop: '32px' }}
      >
        BACK TO DASHBOARD
      </button>
    </div>
  );
}
