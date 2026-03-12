import React, { useState, useContext } from 'react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function QuizBattle({ addXpAndCoins }) {
  const { user } = useContext(AuthContext);
  const [topic, setTopic] = useState('');
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sparkPos, setSparkPos] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic state for real quizzes
  const [quizData, setQuizData] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleStartQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    
    // Fetch quiz from real backend
    const response = await api.generateQuiz(user.username, topic, 3); // 3 questions
    
    if (response && response.questions) {
      setQuizData(response.questions);
      setQuizActive(true);
      setCurrentQuestion(0);
      setShowResult(false);
      setSelectedIndices([]);
    } else {
      alert("Failed to generate quiz. Is the backend running?");
    }
    
    setIsLoading(false);
  };

  const handleAnswer = (e, index) => {
    if (showResult) return;
    
    // Record selection
    setSelectedIndices(prev => {
      const newSel = [...prev];
      newSel[currentQuestion] = index;
      return newSel;
    });

    const correct = index === quizData[currentQuestion].correct_index;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      // Trigger spark effect at click position
      const rect = e.target.getBoundingClientRect();
      setSparkPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setSparkPos(null), 600);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowResult(false);
    } else {
      // Quiz complete! Submit to backend
      setIsLoading(true);
      const progResponse = await api.submitQuiz(user.username, topic, quizData, selectedIndices);
      setIsLoading(false);
      
      if (progResponse) {
         // Hacky logic to figure out earned diff since API returns total
         // For Demo purposes, we continue using local visual progression
         const numCorrect = selectedIndices.filter((sel, idx) => sel === quizData[idx].correct_index).length;
         addXpAndCoins(numCorrect * 20, numCorrect * 5); // Simulated visual gain based on accuracy
      }
      
      setQuizActive(false);
      setTopic('');
    }
  };

  if (!quizActive) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="dialog-box" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--retro-red)', marginBottom: '24px' }}>WILD QUIZ APPEARED!</h2>
          <p style={{ marginBottom: '24px' }}>Enter a topic to generate a quiz battle.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
            {['Intro to AI', 'Machine Learning', 'Neural Networks', 'Deep Learning'].map(t => (
              <button 
                key={t}
                className="pixel-btn" 
                style={{ 
                  backgroundColor: topic === t ? 'var(--retro-blue)' : 'white',
                  color: topic === t ? 'white' : 'var(--retro-text)',
                  fontSize: '8px',
                  padding: '12px'
                }}
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="pixel-btn blue" onClick={handleStartQuiz} style={{ width: '100%', padding: '16px' }}>
            BATTLE START!
          </button>
        </div>
      </div>
    );
  }

  const q = quizData[currentQuestion];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Battle Scene Top (Opponent/Question) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '24px' }}>
        <div className="dialog-box" style={{ width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' }}>
          <div style={{ fontSize: '10px', color: 'var(--retro-red)', marginBottom: '8px' }}>QUESTION {currentQuestion + 1}/{quizData.length}</div>
          <div style={{ lineHeight: '1.6', fontSize: '16px' }}>{q.question}</div>
        </div>
      </div>

      {/* Battle Scene Bottom (Player/Answers) */}
      <div className="pixel-box" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, backgroundColor: 'white', position: 'relative' }}>
        
        {showResult ? (
           <div style={{ textAlign: 'center', padding: '24px' }}>
            <h2 style={{ color: isCorrect ? 'var(--retro-green)' : 'var(--retro-red)', marginBottom: '16px' }}>
              {isCorrect ? "IT'S SUPER EFFECTIVE!" : "NOT VERY EFFECTIVE..."}
            </h2>
            {isCorrect && <p style={{ color: 'var(--retro-yellow)', marginBottom: '24px' }}>Great Job!</p>}
            
             <button className="pixel-btn" onClick={handleNext} disabled={isLoading}>
              {currentQuestion < quizData.length - 1 ? 'NEXT QUESTION ►' : (isLoading ? 'SAVING...' : 'FINISH BATTLE')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px' }}>
            {q.options.map((opt, idx) => (
              <button 
                key={idx}
                className="pixel-btn"
                style={{ backgroundColor: 'white', color: 'var(--retro-text)', textAlign: 'left', minHeight: '60px', position: 'relative', overflow: 'hidden' }}
                onClick={(e) => handleAnswer(e, idx)}
              >
                <div style={{ display: 'flex' }}>
                  <span style={{ marginRight: '8px', color: 'var(--retro-red)' }}>►</span> 
                  {opt}
                </div>
                {sparkPos && idx === quizData[currentQuestion].correct_index && (
                  <div className="spark-effect" style={{ left: sparkPos.x - 10, top: sparkPos.y - 10 }}></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
