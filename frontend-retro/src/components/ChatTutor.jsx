import React, { useState, useContext } from 'react';
import { Send } from 'lucide-react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function ChatTutor() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello there! I am Professor AI. What topic would you like to study today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputMessage('');
    setIsThinking(true);
    
    // Fetch AI response
    const response = await api.askTutor(user.username, userMsg);
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: response.answer 
    }]);
    setIsThinking(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className="dialog-box"
            style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? 'var(--retro-bg-light)' : 'white',
              maxWidth: '85%'
            }}
          >
            <div style={{ color: msg.role === 'user' ? 'var(--retro-blue)' : 'var(--retro-red)', marginBottom: '8px', fontSize: '10px' }}>
              {msg.role === 'user' ? 'YOU' : 'PROFESSOR AI'}
            </div>
            <div style={{ lineHeight: '1.6' }}>{msg.content}</div>
          </div>
        ))}
        {isThinking && (
          <div className="dialog-box" style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div className="flash">...</div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="pixel-box" style={{ display: 'flex', gap: '12px', padding: '12px' }}>
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask the Tutor..."
          style={{ 
            flex: 1, 
            fontFamily: 'inherit',
            fontSize: '12px',
            border: '2px solid var(--retro-border)',
            padding: '8px 12px',
            outline: 'none'
          }}
        />
        <button 
          className="pixel-btn" 
          onClick={handleSendMessage}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Send size={14} /> Send
        </button>
      </div>
      
    </div>
  );
}
