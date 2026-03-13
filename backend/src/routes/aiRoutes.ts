import express from 'express';
import { handleAIChat, handleGenerateDiet } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = express.Router();

router.post('/chat', protect as any, handleAIChat as any);
router.post('/diet/generate', protect as any, cacheMiddleware(3600), handleGenerateDiet as any);

export default router;
