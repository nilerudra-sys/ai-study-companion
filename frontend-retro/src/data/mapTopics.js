export const mapTopics = [
  {
    id: 1,
    label: 'Intro to AI',
    slug: 'intro-to-ai',
    status: 'completed',
    x: 20,
    y: 20,
    difficulty: '⭐',
    concepts: ['What is AI?', 'History of AI', 'Types of AI'],
    description: 'Learn what AI is, where it came from, and how it is used today.',
    gymLeader: 'AI Historian',
    xpReward: 50,
    coinReward: 10
  },
  {
    id: 2,
    label: 'Machine Learning',
    slug: 'machine-learning',
    status: 'completed',
    x: 50,
    y: 50,
    difficulty: '⭐⭐',
    concepts: ['Supervised Learning', 'Regression', 'Classification Models'],
    description: 'Train models from data and understand the core ML task types.',
    gymLeader: 'ML Expert',
    xpReward: 100,
    coinReward: 20
  },
  {
    id: 3,
    label: 'Neural Networks',
    slug: 'neural-networks',
    status: 'current',
    x: 80,
    y: 30,
    difficulty: '⭐⭐⭐',
    concepts: ['Perceptrons', 'Backpropagation', 'Activation Functions'],
    description: 'Explore neurons, layers, and how networks learn through backprop.',
    gymLeader: 'Neural Nets Champion',
    xpReward: 150,
    coinReward: 30
  },
  {
    id: 4,
    label: 'Deep Learning',
    slug: 'deep-learning',
    status: 'locked',
    x: 80,
    y: 80,
    difficulty: '⭐⭐⭐⭐',
    concepts: ['CNNs', 'RNNs', 'Deep Architectures'],
    description: 'Go deeper with modern architectures used for vision and sequences.',
    gymLeader: 'Deep Thinker',
    xpReward: 200,
    coinReward: 40
  },
  {
    id: 5,
    label: 'Transformers',
    slug: 'transformers',
    status: 'locked',
    x: 50,
    y: 90,
    difficulty: '⭐⭐⭐⭐⭐',
    concepts: ['Attention Mechanism', 'LLMs', 'Prompt Engineering'],
    description: 'Understand attention and why transformers power today’s LLMs.',
    gymLeader: 'Transformer Prime',
    xpReward: 500,
    coinReward: 100
  }
];

export function topicStatusForUser(topic, user) {
  const completedTopics = user?.completed_topics || [];
  const isCompleted = Array.isArray(completedTopics) && completedTopics.includes(topic.label);

  const base = topic.status;
  if (isCompleted) return { completed: true, unlocked: true, status: 'completed' };
  if (base === 'locked') return { completed: false, unlocked: false, status: 'locked' };
  if (base === 'completed') return { completed: true, unlocked: true, status: 'completed' };
  if (base === 'current') return { completed: false, unlocked: true, status: 'in-progress' };
  return { completed: false, unlocked: true, status: 'in-progress' };
}

