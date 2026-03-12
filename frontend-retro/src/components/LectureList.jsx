import PropTypes from 'prop-types';
import LectureCard from './LectureCard';
import { mapTopics, topicStatusForUser } from '../data/mapTopics';

export default function LectureList({ user, onStartLecture, onWatchVideo, onPracticeQuiz }) {
  return (
    <div className="lecture-list">
      {mapTopics.map(t => (
        <LectureCard
          key={t.id}
          topic={t}
          status={topicStatusForUser(t, user)}
          onStartLecture={onStartLecture}
          onWatchVideo={onWatchVideo}
          onPracticeQuiz={onPracticeQuiz}
        />
      ))}
    </div>
  );
}

LectureList.propTypes = {
  user: PropTypes.object,
  onStartLecture: PropTypes.func.isRequired,
  onWatchVideo: PropTypes.func.isRequired,
  onPracticeQuiz: PropTypes.func.isRequired
};

