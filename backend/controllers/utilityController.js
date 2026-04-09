import { db } from '../config/database.js';

export const sendReminder = (req, res) => {
  try {
    const { appointmentIds, deliveryMethod, message } = req.body;
    
    // In production, integrate with email/SMS service
    res.json({
      success: true,
      message: `Reminders sent via ${deliveryMethod} to ${appointmentIds.length} recipients`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const exportData = (req, res) => {
  try {
    const { dataType, format, dateRange } = req.body;
    
    let data = [];
    if (dataType === 'appointments') {
      data = Array.from(db.appointments.values());
    } else if (dataType === 'patients') {
      data = Array.from(db.patients.values());
    } else if (dataType === 'doctors') {
      data = Array.from(db.doctors.values());
    } else if (dataType === 'employees') {
      data = Array.from(db.employees.values());
    }

    // Generate CSV
    if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => row[h]).join(','))
      ].join('\n');

      res.json({
        success: true,
        format: 'csv',
        data: csv,
        fileName: `${dataType}_${new Date().toISOString().split('T')[0]}.csv`
      });
    } else {
      res.json({
        success: true,
        format,
        data,
        fileName: `${dataType}_${new Date().toISOString().split('T')[0]}.${format}`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfile = (req, res) => {
  try {
    // In production, get from JWT token (req.user)
    const user = Array.from(db.users.values())[0];
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    // In production, get userId from JWT token
    const userId = Array.from(db.users.keys())[0];
    
    const user = db.users.get(userId);
    const updated = {
      ...user,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      phone: phone || user.phone
    };

    db.users.set(userId, updated);
    const { password, ...userWithoutPassword } = updated;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const healthCheck = (req, res) => {
  res.json({ success: true, status: 'ok', message: 'Server is running' });
};
