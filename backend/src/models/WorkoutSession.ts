import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkoutSession extends Document {
  userId: mongoose.Types.ObjectId;
  workoutId: mongoose.Types.ObjectId;
  duration: number; // in minutes
  caloriesBurned: number;
  reps?: number;
  completedAt: Date;
}

const WorkoutSessionSchema = new Schema<IWorkoutSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workoutId: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  reps: { type: Number, default: null },
  completedAt: { type: Date, default: Date.now },
});

const WorkoutSession: Model<IWorkoutSession> = mongoose.models.WorkoutSession || mongoose.model<IWorkoutSession>('WorkoutSession', WorkoutSessionSchema);
export default WorkoutSession;
