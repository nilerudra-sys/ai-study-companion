import { useState, useEffect, useRef } from 'react';
import { api } from './api';
import TopHUD from './components/TopHUD';
import SideMenu from './components/SideMenu';
import './index.css';

// Placeholder components for the main views
import ChatTutor from './components/ChatTutor';
import QuizBattle from './components/QuizBattle';
import ProgressMap from './components/ProgressMap';
import Badges from './components/Badges';
import GymLeaderBattle from './components/GymLeaderBattle';
import HomePage from './pages/HomePage';
import HomeDashboard from './pages/HomeDashboard';
import TrainerArena from './pages/TrainerArena';
import Profile from './pages/Profile';
import Train from './pages/Train';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProgressDex from './pages/ProgressDex';
import PokeSchool from './pages/PokeSchool';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

function MainApp() {
  const { user, loading: authLoading, updateProgressLocally } = useContext(AuthContext);
  const [authView, setAuthView] = useState('login');
  const [showHomepage, setShowHomepage] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [expertTrainer, setExpertTrainer] = useState(null);
  const [selectedTopicForTrain, setSelectedTopicForTrain] = useState(null);
  
  const [playerState, setPlayerState] = useState({
    name: "rudy",
    level: 1,
    xp: 0,
    coins: 0,
    badges: []
  });

  const bgmRef = useRef(null);
  const [currentBgm, setCurrentBgm] = useState(null);

  // Background Music Manager
  useEffect(() => {
    let newTrack = null;
    if (showHomepage) {
      newTrack = '/audio/homepage.mp3';
    } else if (currentView === 'quiz' || currentView === 'gym-leader') {
      newTrack = '/audio/battle.mp3';
    } else {
      newTrack = '/audio/dashboard.mp3';
    }

    if (currentBgm !== newTrack) {
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
      setCurrentBgm(newTrack);
      if (newTrack) {
        bgmRef.current = new Audio(newTrack);
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.3; // keep it subtle
        bgmRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
      }
    }
  }, [showHomepage, currentView, currentBgm]);

  // Load progress from Auth Context instead of raw fetch
  useEffect(() => {
    if (user) {
      setPlayerState({
        name: user.username,
        level: user.level || 1,
        xp: user.xp || 0,
        coins: user.coins || 0,
        badges: [] 
      });
      setIsLoadingProgress(false);
    }
  }, [user]);

  // Sync to database
  const syncProgressToDB = async (xpGain, coinsGain, level, completedTopics) => {
    if (!user) return;
    try {
      const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'}/auth`;
      const response = await fetch(`${BASE_URL}/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          xp_gain: xpGain,
          coins_gain: coinsGain,
          level: level,
          completed_topics: completedTopics
        })
      });
      if (response.ok) {
        const data = await response.json();
        updateProgressLocally(data.user);
      }
    } catch (e) {
      console.error("Failed to sync progress:", e);
    }
  };

  // Helpers to simulate gamification visuals on the fly
  const addXpAndCoins = (xpAmount, coinsAmount) => {
    setPlayerState(prev => {
      let newXp = prev.xp + xpAmount;
      let newLevel = prev.level;
      let newCoins = prev.coins + coinsAmount;
      const xpMax = prev.level * 100;
      
      // Level up logic
      if (newXp >= xpMax) {
        newLevel += 1;
        newXp -= xpMax;
        alert(`LEVEL UP! You are now Level ${newLevel}!`);
      }
      
      // Fire async sync to DB
      syncProgressToDB(xpAmount, coinsAmount, newLevel, user.completed_topics || []);
      
      return { ...prev, level: newLevel, xp: newXp, coins: newCoins };
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard setView={setCurrentView} playerState={playerState} />;
      case 'pokeschool':
        return <PokeSchool setView={setCurrentView} setSelectedTopicForTrain={setSelectedTopicForTrain} />;
      case 'chat':
        return <ChatTutor />;
      case 'quiz':
        return <QuizBattle addXpAndCoins={addXpAndCoins} />;
      case 'gym-leader':
        return <GymLeaderBattle addXpAndCoins={addXpAndCoins} setView={setCurrentView} expertTrainer={expertTrainer} />;
      case 'trainer-arena':
        return <TrainerArena setView={setCurrentView} setExpertTrainer={setExpertTrainer} />;
      case 'profile':
        return <Profile playerState={playerState} setView={setCurrentView} />;
      case 'train':
        return <Train selectedTopicForTrain={selectedTopicForTrain} setView={setCurrentView} setExpertTrainer={setExpertTrainer} />;
      case 'map':
        return <ProgressMap setView={setCurrentView} playerState={playerState} setSelectedTopicForTrain={setSelectedTopicForTrain} />;
      case 'badges':
        return <Badges playerState={playerState} />;
      case 'progressdex':
        return <ProgressDex />;
      case 'inventory':
        return (
          <div className="dialog-box">
            <h2>INVENTORY</h2>
            <p>You have {playerState.coins} coins.</p>
            <p>Future iterations will allow you to buy study power-ups!</p>
          </div>
        );
      default:
        return <HomeDashboard setView={setCurrentView} playerState={playerState} />;
    }
  };

  // 1. Initial Router check - if on homepage, only render that.
  if (showHomepage) {
    return <HomePage onStartLearning={() => setShowHomepage(false)} />;
  }

  // Authentication Gates
  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: 'white' }}>
        <h1 className="flash">LOADING SAVE DATA...</h1>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? <Login setAuthView={setAuthView} /> : <Signup setAuthView={setAuthView} />;
  }

  // 2. Otherwise render the main game UI dashboard.
  return (
    <div className="app-container">
      <TopHUD playerState={playerState} />
      
      <div className="layout-main">
        <SideMenu currentView={currentView} setView={setCurrentView} />
        
        <div className="layout-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
