import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  totalReps: number;
  workoutDuration: number; // in minutes
  caloriesBurned: number;
  weeklyProgress: number; // percentage or fraction
}

const UserStatsSchema = new Schema<IUserStats>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalReps: { type: Number, default: 0 },
  workoutDuration: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  weeklyProgress: { type: Number, default: 0.0 }, // this can be calculated dynamically or updated per workout
});

const UserStats: Model<IUserStats> = mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema);
export default UserStats;
