import { db } from '../config/database.js';

export const getAllPatients = (req, res) => {
  try {
    const allPatients = Array.from(db.patients.values());
    res.json(allPatients);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createPatient = (req, res) => {
  try {
    const { name, age, gender, phone, email, dob, condition } = req.body;
    
    const id = Date.now().toString();
    const patient = {
      id,
      name,
      age,
      gender,
      phone,
      email,
      dob,
      condition,
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    db.patients.set(id, patient);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPatientById = (req, res) => {
  try {
    const patient = db.patients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePatient = (req, res) => {
  try {
    const patient = db.patients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const updated = { ...patient, ...req.body };
    db.patients.set(req.params.id, updated);
    res.json({ success: true, patient: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
