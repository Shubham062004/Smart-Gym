import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // typical duration in minutes or seconds
  caloriesPerMinute: number;
  targetMuscles: string[];
  poseDetectionRules: {
    startAngle?: number;
    endAngle?: number;
    joints: string[]; // e.g., ["hip", "knee", "ankle"]
  };
  imageUrl?: string;
  createdAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  duration: { type: Number, default: 5 },
  caloriesPerMinute: { type: Number, default: 10 },
  targetMuscles: [{ type: String }],
  poseDetectionRules: {
    startAngle: Number,
    endAngle: Number,
    joints: [{ type: String }]
  },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Exercise: Model<IExercise> = mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);
export default Exercise;
