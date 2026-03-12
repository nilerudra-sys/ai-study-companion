import React from 'react';
import { MessageSquare, Target, Map, Trophy, Backpack, BookOpen, GraduationCap } from 'lucide-react';

export default function SideMenu({ currentView, setView }) {
  const menuItems = [
    { id: 'home', label: 'Home Dashboard', icon: <Target size={16} /> },
    { id: 'pokeschool', label: 'PokeSchool', icon: <GraduationCap size={16} /> },
    { id: 'chat', label: 'Ask AI Tutor', icon: <MessageSquare size={16} /> },
    { id: 'quiz', label: 'Start Quiz Battle', icon: <Target size={16} /> },
    { id: 'map', label: 'Progress Map', icon: <Map size={16} /> },
    { id: 'progressdex', label: 'ProgressDex', icon: <BookOpen size={16} /> },
    { id: 'profile', label: 'Trainer Profile', icon: <Backpack size={16} /> },
    { id: 'badges', label: 'Badges & Achievements', icon: <Trophy size={16} /> },
    { id: 'inventory', label: 'Inventory', icon: <Backpack size={16} /> },
  ];

  return (
    <div className="layout-sidebar">
      <h3 style={{ textAlign: 'center', margin: '8px 0 16px', color: 'var(--retro-red)' }}>MENU</h3>
      {menuItems.map(item => (
        <button
          key={item.id}
          className={`pixel-btn ${currentView === item.id ? 'blue' : ''}`}
          onClick={() => setView(item.id)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            textAlign: 'left', 
            minHeight: '48px',
            padding: '12px'
          }}
        >
          <div style={{ flexShrink: 0 }}>{item.icon}</div>
          <span style={{ fontSize: '10px', lineHeight: '1.4' }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
