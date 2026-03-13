import { Request, Response } from 'express';
import WorkoutSession from '../models/WorkoutSession';
import mongoose from 'mongoose';

export const getWeeklyProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await WorkoutSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), completedAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          reps: { $sum: "$totalReps" },
          count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaloriesBurned = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const stats = await WorkoutSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          calories: { $sum: "$caloriesBurned" }
      }},
      { $sort: { "_id": 1 } },
      { $limit: 30 }
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
