import PropTypes from 'prop-types';

export default function TopicProgressBar({ topic, percent }) {
  const p = Math.max(0, Math.min(100, Math.round(percent || 0)));
  return (
    <div className="dex-progress-row">
      <div className="dex-progress-topic">{topic}</div>
      <div className="dex-progress-bar" aria-label={`${topic} progress`}>
        <div className="dex-progress-fill" style={{ width: `${p}%` }} />
      </div>
      <div className="dex-progress-percent">{p}%</div>
    </div>
  );
}

TopicProgressBar.propTypes = {
  topic: PropTypes.string.isRequired,
  percent: PropTypes.number
};

