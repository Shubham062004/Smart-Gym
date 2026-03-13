import express from 'express';
import { getDietPlan, generateDietPlan, updateDietPreferences } from '../controllers/dietController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect as any, getDietPlan as any);
router.post('/generate', protect as any, generateDietPlan as any);
router.put('/preferences', protect as any, updateDietPreferences as any);

export default router;
