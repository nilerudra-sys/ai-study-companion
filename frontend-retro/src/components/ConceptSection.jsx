import React from 'react';

export default function ConceptSection({ topic }) {
  if (!topic) return null;

  return (
    <div className="pixel-box" style={{ marginBottom: '16px', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px dotted #ccc', paddingBottom: '8px', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: 'var(--retro-red)', fontSize: '16px' }}>{topic.label}</h2>
        <span style={{ fontSize: '10px', color: 'var(--retro-blue)' }}>Difficulty: {topic.difficulty}</span>
      </div>

      <p style={{ fontSize: '10px', lineHeight: '1.6', marginBottom: '16px', color: 'var(--retro-text)' }}>
        {topic.description || "Learn the fundamental concepts of this domain to strengthen your knowledge baseline and prepare for the Gym Leader."}
      </p>

      {topic.concepts && topic.concepts.length > 0 && (
        <>
          <h3 style={{ fontSize: '12px', color: 'var(--retro-blue)', marginBottom: '8px' }}>Core Concepts</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '10px', lineHeight: '1.8' }}>
            {topic.concepts.map((concept, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{concept}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
