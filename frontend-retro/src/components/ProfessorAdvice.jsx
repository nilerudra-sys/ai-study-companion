import PropTypes from 'prop-types';

export default function ProfessorAdvice({ message }) {
  return (
    <div className="dex-professor dialog-box">
      <div className="dex-professor-title">PROFESSOR AI</div>
      <div className="dex-professor-text" style={{ whiteSpace: 'pre-wrap' }}>
        {message || "Hello Trainer! I have analyzed your learning journey.\n\nTake a quiz to begin your ProgressDex!"}
      </div>
    </div>
  );
}

ProfessorAdvice.propTypes = {
  message: PropTypes.string
};

