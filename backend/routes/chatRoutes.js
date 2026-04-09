import express from 'express';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chatController.chat);
router.get('/:sessionId', chatController.getChatHistory);
router.delete('/:sessionId', chatController.clearChatHistory);

export default router;
