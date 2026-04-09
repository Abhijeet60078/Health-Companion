import express from 'express';
import * as waitingListController from '../controllers/waitingListController.js';

const router = express.Router();

router.get('/', waitingListController.getAllWaitingList);
router.post('/', waitingListController.createWaitingRequest);
router.put('/:id/approve', waitingListController.approveWaitingRequest);
router.put('/:id/reject', waitingListController.rejectWaitingRequest);

export default router;
