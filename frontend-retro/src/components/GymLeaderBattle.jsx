import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function GymLeaderBattle({ addXpAndCoins, setView, expertTrainer }) {
  const { user } = useContext(AuthContext);
  const [topic, setTopic] = useState(expertTrainer ? expertTrainer.topic : 'Machine Learning');
  const [isBattling, setIsBattling] = useState(false);
  const [loading, setLoading] = useState(true); // Start loading immediately
  
  // Battle State
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [studentHp, setStudentHp] = useState(3);
  const [leaderHp, setLeaderHp] = useState(5);
  
  const [battleMessage, setBattleMessage] = useState(`A challenge from ${expertTrainer ? expertTrainer.name : 'GYM LEADER'}!`);
  const [battleEnded, setBattleEnded] = useState(false);
  const [victory, setVictory] = useState(false);

  // Auto-start battle on mount if we have a trainer
  useEffect(() => {
    handleStartBattle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate Expert Quiz
  const handleStartBattle = async () => {
    setLoading(true);
    const trainerName = expertTrainer ? expertTrainer.name : "Gym Leader";
    setBattleMessage(`${trainerName} is preparing a challenge on ${topic}...`);
    
    // We request 5 expert questions
    const data = await api.generateExpertQuiz(user.username, topic, 5);
    
    if (data && data.questions) {
      setQuizData(data.questions);
      setStudentHp(3);
      setLeaderHp(data.questions.length); // e.g. 5
      setCurrentQuestionIndex(0);
      setBattleEnded(false);
      setVictory(false);
      setIsBattling(true);
      setBattleMessage(`"So, you think you understand ${topic}? Let's battle!"`);
    } else {
      setBattleMessage("Gym Leader is busy. Try again later.");
    }
    setLoading(false);
  };

  const handleAnswer = (selectedIndex) => {
    if (battleEnded) return;

    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correct_index;

    if (isCorrect) {
      const newLeaderHp = leaderHp - 1;
      setLeaderHp(newLeaderHp);
      if (newLeaderHp <= 0) {
        setBattleMessage("Critical Hit! The Gym Leader fainted!");
        handleVictory();
      } else {
        setBattleMessage("It's super effective! Gym Leader's HP dropped.");
        nextTurn();
      }
    } else {
      const newStudentHp = studentHp - 1;
      setStudentHp(newStudentHp);
      if (newStudentHp <= 0) {
        setBattleMessage("Gym Leader defeated you. Train more and try again.");
        handleDefeat();
      } else {
        setBattleMessage("Incorrect! You took damage.");
        nextTurn();
      }
    }
  };

  const nextTurn = () => {
    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setBattleMessage(`${trainerName} unleashes the next attack!`);
      } else {
        // Ran out of questions but both survived.
        setBattleMessage(`${trainerName} defeated you. Train more and try again.`);
        handleDefeat();
      }
    }, 2000);
  };

  const handleVictory = () => {
    setBattleEnded(true);
    setVictory(true);
    // Huge rewards
    addXpAndCoins(500, 250);
  };

  const handleDefeat = () => {
    setBattleEnded(true);
    setVictory(false);
  };

    if (!isBattling || loading) {
    return (
      <div className="pixel-box" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--retro-red)' }}>{expertTrainer ? `VS. ${expertTrainer.name}` : 'EXPERT MODE: GYM CHALLENGE'}</h2>
        
        {loading ? (
          <div style={{ padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'spark 1s infinite' }}>
              {expertTrainer ? expertTrainer.sprite : '👾'}
            </div>
            <p className="flash" style={{ color: 'var(--retro-blue)' }}>Loading Arena (CrewAI generating)...</p>
          </div>
        ) : (
          <button className="pixel-btn" style={{ backgroundColor: 'var(--retro-red)' }} onClick={handleStartBattle}>
            RETRY CHALLENGE
          </button>
        )}
      </div>
    );
  }

  // Battle Active View
  const question = quizData[currentQuestionIndex];
  const trainerSprite = expertTrainer ? expertTrainer.sprite : '👾';
  const trainerName = expertTrainer ? expertTrainer.name : 'GYM LEADER';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      
      {/* Top Arena - Leader */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="pixel-box" style={{ width: '200px', padding: '10px' }}>
          <div style={{ fontSize: '10px', marginBottom: '8px' }}>{trainerName.toUpperCase()}</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ opacity: i < leaderHp ? 1 : 0.3 }}>🟥</span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '48px' }}>{trainerSprite}</div>
      </div>

      {/* Middle Arena - Student */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
        <div style={{ fontSize: '48px' }}>👦</div>
        <div className="pixel-box" style={{ width: '200px', padding: '10px', border: '4px solid var(--retro-blue)' }}>
          <div style={{ fontSize: '10px', marginBottom: '8px' }}>STUDENT</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ opacity: i < studentHp ? 1 : 0.3 }}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogue and Action Box */}
      <div className="dialog-box" style={{ minHeight: '120px', marginTop: '16px' }}>
        <p style={{ fontSize: '12px', lineHeight: '1.6', marginBottom: '16px' }}>{battleMessage}</p>
        
        {!battleEnded && question && !battleMessage.includes("effective") && !battleMessage.includes("Incorrect") && (
          <div>
            <p style={{ fontSize: '10px', color: 'var(--retro-blue)', marginBottom: '16px' }}>{question.question}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {question.options.map((opt, i) => (
                <button key={i} className="pixel-btn" style={{ fontSize: '8px', padding: '8px' }} onClick={() => handleAnswer(i)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {battleEnded && victory && (
          <div>
            <p style={{ color: 'var(--retro-orange)' }} className="flash">REWARD ACHIEVED: +500 XP | +250 Coins | Badges Updated</p>
            <button className="pixel-btn blue" style={{ marginTop: '16px' }} onClick={() => setView('home')}>RETURN TO HUB</button>
          </div>
        )}

        {battleEnded && !victory && (
          <div>
            <button className="pixel-btn blue" style={{ marginTop: '16px' }} onClick={() => setIsBattling(false)}>TRY AGAIN</button>
          </div>
        )}
      </div>

    </div>
  );
}
