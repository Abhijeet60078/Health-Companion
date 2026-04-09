import express from 'express';
import * as utilityController from '../controllers/utilityController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, utilityController.getProfile);
router.put('/profile', authMiddleware, utilityController.updateProfile);

export default router;
