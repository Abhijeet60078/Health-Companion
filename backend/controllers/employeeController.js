import { db } from '../config/database.js';

export const getAllEmployees = (req, res) => {
  try {
    const allEmployees = Array.from(db.employees.values());
    res.json(allEmployees);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
