import { db } from '../config/database.js';

export const getAllAppointments = (req, res) => {
  try {
    const allAppointments = Array.from(db.appointments.values());
    res.json(allAppointments);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAppointment = (req, res) => {
  try {
    const { patientName, doctorName, date, time, reason } = req.body;
    
    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const id = Date.now().toString();
    const appointment = {
      id,
      patientName,
      doctorName,
      date,
      time,
      reason,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    db.appointments.set(id, appointment);
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAppointmentById = (req, res) => {
  try {
    const appointment = db.appointments.get(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAppointment = (req, res) => {
  try {
    const appointment = db.appointments.get(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    const updated = { ...appointment, ...req.body };
    db.appointments.set(req.params.id, updated);
    res.json({ success: true, appointment: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAppointment = (req, res) => {
  try {
    db.appointments.delete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
