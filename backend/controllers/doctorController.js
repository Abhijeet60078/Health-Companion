import { db } from '../config/database.js';

export const getAllDoctors = (req, res) => {
  try {
    const allDoctors = Array.from(db.doctors.values());
    res.json(allDoctors);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDoctorById = (req, res) => {
  try {
    const doctor = db.doctors.get(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
