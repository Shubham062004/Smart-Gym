import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  difficulty: string;
  duration: number; // in minutes
  calories: number;
  image?: string;
  isLocked: boolean;
}

const WorkoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  difficulty: { type: String, required: true },
  duration: { type: Number, required: true },
  calories: { type: Number, required: true },
  image: { type: String, default: null },
  isLocked: { type: Boolean, default: false },
});

const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
