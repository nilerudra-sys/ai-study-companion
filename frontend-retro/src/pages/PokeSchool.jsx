import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LectureList from '../components/LectureList';

export default function PokeSchool({ setView, setSelectedTopicForTrain }) {
  const { user } = useContext(AuthContext);

  const handleStartLecture = (topic) => {
    setSelectedTopicForTrain(topic);
    setView('train');
  };

  const handleWatchVideo = (topic) => {
    setSelectedTopicForTrain(topic);
    setView('train');
  };

  const handlePracticeQuiz = () => {
    setView('quiz');
  };

  return (
    <div className="pokeschool-container">
      <div className="pokeschool-header pixel-box">
        <div className="chalkboard">
          <div className="chalk-title">POKESCHOOL LECTURE HALL</div>
          <div className="chalk-subtitle">Select a lecture to begin training before your next battle.</div>
        </div>
      </div>

      <div className="pokeschool-panel pixel-box">
        <h2 style={{ color: 'var(--retro-red)' }}>LECTURE LIST</h2>
        <LectureList
          user={user}
          onStartLecture={handleStartLecture}
          onWatchVideo={handleWatchVideo}
          onPracticeQuiz={handlePracticeQuiz}
        />
      </div>
    </div>
  );
}

