import { db } from '../config/database.js';

export const getAllWaitingList = (req, res) => {
  try {
    const allWaiting = Array.from(db.waitingList.values());
    res.json(allWaiting);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createWaitingRequest = (req, res) => {
  try {
    const { patientName, doctorName, reason, priority } = req.body;
    
    const id = Date.now().toString();
    const request = {
      id,
      patientName,
      doctorName,
      reason,
      priority: priority || 'medium',
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      approvedDate: null
    };

    db.waitingList.set(id, request);
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const approveWaitingRequest = (req, res) => {
  try {
    const request = db.waitingList.get(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    request.status = 'approved';
    request.approvedDate = new Date().toISOString().split('T')[0];
    db.waitingList.set(req.params.id, request);
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const rejectWaitingRequest = (req, res) => {
  try {
    const request = db.waitingList.get(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    request.status = 'rejected';
    db.waitingList.set(req.params.id, request);
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
