import React from 'react';

export default function VideoSection({ videoUrl, videoTitle }) {
  if (!videoUrl) return null;

  return (
    <div className="pixel-box" style={{ marginBottom: '16px', backgroundColor: '#f0f0f0' }}>
      <h3 style={{ fontSize: '12px', color: 'var(--retro-red)', marginBottom: '16px', borderBottom: '4px dotted #ccc', paddingBottom: '8px' }}>
        Video Lesson
      </h3>
      
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', border: '4px solid var(--retro-border)', backgroundColor: '#000' }}>
        <iframe 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          src={videoUrl} 
          title={videoTitle || "Video Lesson"}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
