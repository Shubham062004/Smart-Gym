import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from './src/models/Exercise';
import connectDB from './src/config/db';

dotenv.config();

const exercises = [
  {
    name: 'Pushups',
    difficulty: 'beginner',
    duration: 5,
    caloriesPerMinute: 8,
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    poseDetectionRules: {
      startAngle: 160,
      endAngle: 70,
      joints: ['shoulder', 'elbow', 'wrist']
    }
  },
  {
    name: 'Squats',
    difficulty: 'beginner',
    duration: 5,
    caloriesPerMinute: 10,
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    poseDetectionRules: {
      startAngle: 170,
      endAngle: 90,
      joints: ['hip', 'knee', 'ankle']
    }
  },
  {
    name: 'Lunges',
    difficulty: 'intermediate',
    duration: 8,
    caloriesPerMinute: 9,
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    poseDetectionRules: {
      startAngle: 170,
      endAngle: 95,
      joints: ['hip', 'knee', 'ankle']
    }
  },
  {
    name: 'Planks',
    difficulty: 'beginner',
    duration: 3,
    caloriesPerMinute: 5,
    targetMuscles: ['Core', 'Shoulders'],
    poseDetectionRules: {
      startAngle: 180,
      endAngle: 180,
      joints: ['shoulder', 'hip', 'ankle']
    }
  },
  {
    name: 'Crunches',
    difficulty: 'beginner',
    duration: 5,
    caloriesPerMinute: 6,
    targetMuscles: ['Abs'],
    poseDetectionRules: {
      startAngle: 180,
      endAngle: 45,
      joints: ['shoulder', 'hip', 'knee']
    }
  }
];

const seedExercises = async () => {
  try {
    await connectDB();
    await Exercise.deleteMany();
    await Exercise.insertMany(exercises);
    console.log('Exercises seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
};

seedExercises();
