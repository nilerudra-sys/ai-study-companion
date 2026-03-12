import { useEffect, useMemo, useState, useContext } from 'react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

import ProfessorAdvice from '../components/ProfessorAdvice';
import QuizHistoryCard from '../components/QuizHistoryCard';
import TopicProgressBar from '../components/TopicProgressBar';

export default function ProgressDex() {
  const { user } = useContext(AuthContext);
  const userId = user?.username || user?.id || 'demo-student';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  const topicProgress = useMemo(() => {
    if (!stats?.topic_progress) return [];
    return stats.topic_progress.map(t => ({
      topic: t.topic,
      percent: Math.round((t.avg_score || 0) * 100),
      attempts: t.attempts
    }));
  }, [stats]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [s, h] = await Promise.all([
        api.fetchProgressStats(userId),
        api.fetchQuizHistory(userId, 50),
      ]);
      if (cancelled) return;
      setStats(s);
      setHistory(h || []);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
    return (
      <div className="dialog-box">
        <h2 className="flash">LOADING PROGRESSDEX...</h2>
      </div>
    );
  }

  const overall = stats || {};
  const world = overall.world_summary || { topics_completed: 0, topics_in_progress: 0, topics_locked: 0 };

  return (
    <div className="dex-container">
      <ProfessorAdvice message={overall.professor_advice} />

      <div className="dex-grid">
        <div className="pixel-box">
          <h2 style={{ color: 'var(--retro-red)' }}>PROGRESS STATS</h2>
          <div className="dex-stats">
            <div className="dex-stat"><span>Total Quizzes Taken</span><b>{overall.total_quizzes_taken ?? 0}</b></div>
            <div className="dex-stat"><span>Average Score</span><b>{Math.round((overall.average_score ?? 0) * 100)}%</b></div>
            <div className="dex-stat"><span>Best Topic</span><b>{overall.best_topic || '—'}</b></div>
            <div className="dex-stat"><span>Weakest Topic</span><b>{overall.weakest_topic || '—'}</b></div>
            <div className="dex-stat"><span>Total Questions Answered</span><b>{overall.total_questions_answered ?? 0}</b></div>
          </div>
        </div>

        <div className="pixel-box">
          <h2 style={{ color: 'var(--retro-red)' }}>WORLD SUMMARY</h2>
          <div className="dex-stats">
            <div className="dex-stat"><span>Topics Completed</span><b>{world.topics_completed}</b></div>
            <div className="dex-stat"><span>Topics In Progress</span><b>{world.topics_in_progress}</b></div>
            <div className="dex-stat"><span>Topics Locked</span><b>{world.topics_locked}</b></div>
          </div>
        </div>
      </div>

      <div className="pixel-box" style={{ marginTop: 16 }}>
        <h2 style={{ color: 'var(--retro-red)' }}>TOPIC PROGRESS</h2>
        {topicProgress.length ? (
          <div className="dex-progress-list">
            {topicProgress.map(tp => (
              <TopicProgressBar key={tp.topic} topic={tp.topic} percent={tp.percent} />
            ))}
          </div>
        ) : (
          <p>No topic data yet — finish a quiz to start your ProgressDex.</p>
        )}
      </div>

      <div className="dex-grid" style={{ marginTop: 16 }}>
        <div className="pixel-box">
          <h2 style={{ color: 'var(--retro-red)' }}>QUIZ HISTORY</h2>
          <div className="dex-history-list">
            {history.length ? history.map(a => <QuizHistoryCard key={a.id} attempt={a} />) : <p>No quiz attempts yet.</p>}
          </div>
        </div>

        <div className="pixel-box">
          <h2 style={{ color: 'var(--retro-red)' }}>QUIZ HISTORY TABLE</h2>
          {history.length ? (
            <div className="dex-table-wrap">
              <table className="dex-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Correct</th>
                    <th>Wrong</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(a => (
                    <tr key={a.id}>
                      <td>{a.topic}</td>
                      <td>{a.date || '—'}</td>
                      <td>{a.time || '—'}</td>
                      <td>{a.correct_answers}</td>
                      <td>{a.wrong_answers}</td>
                      <td>{Math.round((a.score || 0) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No quiz attempts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

