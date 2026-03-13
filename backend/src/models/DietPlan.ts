import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDietPlan extends Document {
  userId: mongoose.Types.ObjectId;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: {
      name: string;
      description: string;
      calories: number;
      protein: number;
  }[];
  supplements: string[];
  dietType: string;
  intermittentFasting: boolean;
  createdAt: Date;
}

const DietPlanSchema = new Schema<IDietPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dailyCalories: { type: Number, default: 2000 },
  protein: { type: Number, default: 150 },
  carbs: { type: Number, default: 200 },
  fats: { type: Number, default: 70 },
  meals: [
    {
      name: String,
      description: String,
      calories: Number,
      protein: Number,
    }
  ],
  supplements: [String],
  dietType: { type: String, default: 'Balanced' },
  intermittentFasting: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const DietPlan: Model<IDietPlan> = mongoose.models.DietPlan || mongoose.model<IDietPlan>('DietPlan', DietPlanSchema);
export default DietPlan;
