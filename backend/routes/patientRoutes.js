import express from 'express';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

router.get('/', patientController.getAllPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);

export default router;
