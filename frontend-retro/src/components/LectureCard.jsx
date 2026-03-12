import PropTypes from 'prop-types';

export default function LectureCard({ topic, status, onStartLecture, onWatchVideo, onPracticeQuiz }) {
  const locked = status.status === 'locked';
  const completed = status.status === 'completed';
  const inProgress = status.status === 'in-progress';

  return (
    <div className={`lecture-card pixel-box ${locked ? 'locked' : ''}`}>
      <div className="lecture-card-header">
        <div className="lecture-title">{topic.label}</div>
        <div className={`lecture-status ${completed ? 'done' : inProgress ? 'progress' : locked ? 'locked' : ''}`}>
          {completed ? 'COMPLETED' : inProgress ? 'IN PROGRESS' : locked ? 'LOCKED' : 'AVAILABLE'}
        </div>
      </div>

      <div className="lecture-meta">
        <div className="lecture-kv">
          <span>Difficulty:</span> {topic.difficulty}
        </div>
        <div className="lecture-desc">{topic.description}</div>
      </div>

      <div className="lecture-concepts">
        <div className="lecture-concepts-title">Concepts Covered:</div>
        <ul>
          {(topic.concepts || []).slice(0, 6).map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="lecture-actions">
        <button className="pixel-btn" disabled={locked} onClick={() => onStartLecture(topic)}>
          Start Lecture
        </button>
        <button className="pixel-btn blue" disabled={locked} onClick={() => onWatchVideo(topic)}>
          Watch Video
        </button>
        <button className="pixel-btn" style={{ backgroundColor: 'var(--retro-green)' }} disabled={locked} onClick={() => onPracticeQuiz(topic)}>
          Practice Quiz
        </button>
      </div>

      {locked && <div className="lecture-lock-overlay">🔒 LOCKED</div>}
    </div>
  );
}

LectureCard.propTypes = {
  topic: PropTypes.object.isRequired,
  status: PropTypes.shape({
    completed: PropTypes.bool,
    unlocked: PropTypes.bool,
    status: PropTypes.string
  }).isRequired,
  onStartLecture: PropTypes.func.isRequired,
  onWatchVideo: PropTypes.func.isRequired,
  onPracticeQuiz: PropTypes.func.isRequired
};

