import express from 'express';
import * as utilityController from '../controllers/utilityController.js';

const router = express.Router();

router.post('/send-reminder', utilityController.sendReminder);
router.post('/export', utilityController.exportData);
router.get('/health', utilityController.healthCheck);

export default router;
