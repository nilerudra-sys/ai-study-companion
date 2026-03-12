// Simple API service to connect React frontend to FastAPI backend

// Use Vite environment variable for the API base URL so this can be configured
// in deployment environments (e.g., Vercel) without code changes.
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

export const api = {
  
  async fetchProgress(studentId) {
    try {
      const response = await fetch(`${BASE_URL}/progress/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async askTutor(studentId, question, topic = null) {
    try {
      const response = await fetch(`${BASE_URL}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          question: question,
          topic: topic
        })
      });
      if (!response.ok) throw new Error('Failed to fetch explanation');
      return await response.json();
    } catch (error) {
      console.error(error);
      return { answer: "I'm sorry, I'm having trouble connecting to my neural network right now." };
    }
  },

  async generateQuiz(studentId, topic, numQuestions = 3, difficulty = 'beginner') {
    try {
      const response = await fetch(`${BASE_URL}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          topic: topic,
          num_questions: numQuestions,
          difficulty: difficulty
        })
      });
      if (!response.ok) throw new Error('Failed to generate quiz');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async generateExpertQuiz(studentId, topic, numQuestions = 5) {
    try {
      const response = await fetch(`${BASE_URL}/expert-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          topic: topic,
          num_questions: numQuestions
        })
      });
      if (!response.ok) throw new Error('Failed to generate expert quiz');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async submitQuiz(studentId, topic, questions, selectedIndices) {
    try {
      const response = await fetch(`${BASE_URL}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          topic: topic,
          questions: questions,
          selected_indices: selectedIndices
        })
      });
      if (!response.ok) throw new Error('Failed to submit quiz');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  ,

  async fetchQuizHistory(userId, limit = 50) {
    try {
      const response = await fetch(`${BASE_URL}/quiz-history?user_id=${encodeURIComponent(userId)}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch quiz history');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async fetchProgressStats(userId) {
    try {
      const response = await fetch(`${BASE_URL}/progress-stats?user_id=${encodeURIComponent(userId)}`);
      if (!response.ok) throw new Error('Failed to fetch progress stats');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async saveQuizAttempt(payload) {
    try {
      const response = await fetch(`${BASE_URL}/save-quiz-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to save quiz attempt');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

};
