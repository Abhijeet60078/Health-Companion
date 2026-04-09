import express from 'express';
import * as employeeController from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', employeeController.getAllEmployees);

export default router;
