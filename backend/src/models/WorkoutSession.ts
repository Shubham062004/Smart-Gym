import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkoutSession extends Document {
  userId: mongoose.Types.ObjectId;
  exerciseName: string;
  totalReps: number;
  duration: number; // in seconds or minutes (prompt says duration, usually sessions are minutes but camera screen shows seconds) -> let's use number
  caloriesBurned: number;
  formAccuracy: number;
  completedAt: Date;
}

const WorkoutSessionSchema = new Schema<IWorkoutSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseName: { type: String, required: true },
  totalReps: { type: Number, required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  formAccuracy: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

const WorkoutSession: Model<IWorkoutSession> = mongoose.models.WorkoutSession || mongoose.model<IWorkoutSession>('WorkoutSession', WorkoutSessionSchema);
export default WorkoutSession;
