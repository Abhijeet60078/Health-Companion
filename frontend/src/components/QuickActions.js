import React, { useState } from 'react';
import ScheduleNewModal from './modals/ScheduleNewModal';
import WaitingListModal from './modals/WaitingListModal';
import SendReminderModal from './modals/SendReminderModal';
import ExportListModal from './modals/ExportListModal';
import '../styles/quickActions.css';

function QuickActions() {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="quick-actions-section">
        <h3 className="quick-actions-title">
          <i className="fas fa-bolt"></i> Quick Actions
        </h3>
        
        <div className="quick-actions-grid">
          <button 
            className="quick-action-btn"
            onClick={() => handleOpenModal('schedule')}
          >
            <i className="fas fa-plus-circle"></i>
            <span>Schedule New</span>
          </button>

          <button 
            className="quick-action-btn"
            onClick={() => handleOpenModal('waiting')}
          >
            <i className="fas fa-hourglass-half"></i>
            <span>Waiting List</span>
          </button>

          <button 
            className="quick-action-btn"
            onClick={() => handleOpenModal('reminder')}
          >
            <i className="fas fa-bell"></i>
            <span>Send Reminder</span>
          </button>

          <button 
            className="quick-action-btn"
            onClick={() => handleOpenModal('export')}
          >
            <i className="fas fa-download"></i>
            <span>Export List</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'schedule' && (
        <ScheduleNewModal onClose={handleCloseModal} />
      )}
      {activeModal === 'waiting' && (
        <WaitingListModal onClose={handleCloseModal} />
      )}
      {activeModal === 'reminder' && (
        <SendReminderModal onClose={handleCloseModal} />
      )}
      {activeModal === 'export' && (
        <ExportListModal onClose={handleCloseModal} />
      )}
    </>
  );
}

export default QuickActions;
