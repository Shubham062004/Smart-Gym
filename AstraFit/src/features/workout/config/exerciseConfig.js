export const EXERCISES = [
  {
    id: 'pushup',
    name: 'Pushups',
    duration: 5,
    difficulty: 'BEGINNER',
    category: 'bodyweight',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500',
  },
  {
    id: 'squats',
    name: 'Back Squats',
    duration: 8,
    difficulty: 'BEGINNER',
    category: 'bodyweight',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500',
  },
  {
    id: 'bicepcurl',
    name: 'Bicep Curls',
    duration: 5,
    difficulty: 'BEGINNER',
    category: 'resistance',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
  },
  {
    id: 'shoulderpress',
    name: 'Shoulder Press',
    duration: 6,
    difficulty: 'INTERMEDIATE',
    category: 'resistance',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500',
  },
  {
    id: 'bentoverrow',
    name: 'Bent Over Row',
    duration: 6,
    difficulty: 'INTERMEDIATE',
    category: 'resistance',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
  },
  {
    id: 'lateralraise',
    name: 'Lateral Raise',
    duration: 5,
    difficulty: 'BEGINNER',
    category: 'resistance',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
  },
  {
    id: 'bandsquat',
    name: 'Band Squat',
    duration: 8,
    difficulty: 'INTERMEDIATE',
    category: 'resistance',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    duration: 10,
    difficulty: 'ADVANCED',
    category: 'weights',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500',
  },
  {
    id: 'lunges',
    name: 'Lunges',
    duration: 6,
    difficulty: 'BEGINNER',
    category: 'bodyweight',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500',
  }
];

export const getExerciseById = (id) => {
  return EXERCISES.find(ex => ex.id === id) || EXERCISES.find(ex => ex.id === 'squats');
};

// Helper for fuzzy matching names from backend
export const findExerciseIdByName = (name) => {
  if (!name) return 'squats';
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('pushup')) return 'pushup';
  if (nameLower.includes('bicep')) return 'bicepcurl';
  if (nameLower.includes('shoulder press')) return 'shoulderpress';
  if (nameLower.includes('bent over') || nameLower.includes('row')) return 'bentoverrow';
  if (nameLower.includes('lateral')) return 'lateralraise';
  if (nameLower.includes('band squat')) return 'bandsquat';
  if (nameLower.includes('squat')) return 'squats';
  if (nameLower.includes('deadlift')) return 'deadlift';
  if (nameLower.includes('lunge')) return 'lunges';

  return nameLower.replace(/[^a-z]/g, '');
};
