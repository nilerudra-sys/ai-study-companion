import PropTypes from 'prop-types';

export default function QuizHistoryCard({ attempt }) {
  if (!attempt) return null;

  const scorePct = Math.round((attempt.score || 0) * 100);

  return (
    <div className="dex-card pixel-box">
      <div className="dex-card-title">QUIZ LOG #{attempt.id}</div>

      <div className="dex-card-grid">
        <div>
          <div className="dex-kv"><span>Quiz Topic:</span> {attempt.topic}</div>
          <div className="dex-kv"><span>Date:</span> {attempt.date || '—'}</div>
          <div className="dex-kv"><span>Time:</span> {attempt.time || '—'}</div>
        </div>

        <div>
          <div className="dex-kv"><span>Correct:</span> {attempt.correct_answers}</div>
          <div className="dex-kv"><span>Wrong:</span> {attempt.wrong_answers}</div>
          <div className="dex-kv"><span>Accuracy:</span> {scorePct}%</div>
        </div>
      </div>
    </div>
  );
}

QuizHistoryCard.propTypes = {
  attempt: PropTypes.shape({
    id: PropTypes.number.isRequired,
    topic: PropTypes.string.isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
    correct_answers: PropTypes.number.isRequired,
    wrong_answers: PropTypes.number.isRequired,
    total_questions: PropTypes.number,
    score: PropTypes.number
  })
};

