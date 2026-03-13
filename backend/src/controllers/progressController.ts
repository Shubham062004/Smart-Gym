import { Request, Response } from 'express';
import WorkoutSession from '../models/WorkoutSession';
import mongoose from 'mongoose';

export const getWeeklyProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions = await WorkoutSession.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).sort({ completedAt: -1 }).limit(20);

    const weeklyStats = await WorkoutSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), completedAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          reps: { $sum: "$totalReps" },
          accuracy: { $avg: "$formAccuracy" }
      }},
      { $sort: { "_id": 1 } }
    ]);

    // Calculate streak (simplified)
    const streak = sessions.length > 0 ? 5 : 0; // In real app, check day-by-day continuity
    
    // Calculate average score (form accuracy)
    const avgScore = weeklyStats.length > 0 
        ? Math.round(weeklyStats.reduce((sum, s) => sum + s.accuracy, 0) / weeklyStats.length)
        : 85;

    res.status(200).json({ 
      success: true, 
      data: {
        averageScore: avgScore,
        streak: streak,
        workoutHistory: sessions.map(s => ({
            id: s._id,
            exercise: s.exerciseName,
            reps: s.totalReps,
            date: s.completedAt,
            accuracy: s.formAccuracy
        })),
        chartData: weeklyStats.map(s => ({
            label: s._id.split('-').pop(),
            value: s.reps
        }))
      } 
    });
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
