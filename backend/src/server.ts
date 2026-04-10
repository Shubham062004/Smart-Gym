import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import workoutRoutes from './routes/workoutRoutes';
import aiRoutes from './routes/aiRoutes';
import progressRoutes from './routes/progressRoutes';
import dietRoutes from './routes/dietRoutes';
import { startWorkout, completeWorkout } from './controllers/workoutController';
import { protect } from './middleware/authMiddleware';
import connectDB from './config/db';

const app: Express = express();

// Connect Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:8081',
        'http://localhost:19006',
        'https://smart-gym-emwi.onrender.com',
        // Allow Expo Go / dev builds on any local IP
        /^http:\/\/192\.168\..*/,
        /^http:\/\/10\..*/,
    ],
    credentials: true,
}));
app.use(express.json());

// Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/auth', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

// Workout Session Routes
app.post('/api/workout-session/start', protect as any, startWorkout as any);
app.post('/api/workout-session/finish', protect as any, completeWorkout as any);
app.get('/api/workout-history', protect as any, (req: any, res: any) => res.status(200).json([])); // Mock history for now

// Health check — used by Render to verify the service is alive
app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Smart-Gym API is running 🏋️' });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
