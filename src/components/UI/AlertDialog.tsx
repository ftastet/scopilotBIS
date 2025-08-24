import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { useAlertStore } from '../../store/useAlertStore';

const AlertDialog: React.FC = () => {
  const { isOpen, title, message, onConfirm, hide } = useAlertStore();

  const handleConfirm = () => {
    hide();
    if (onConfirm) {
      onConfirm();
    }
  };

  const getAlertClass = () => {
    if (title.toLowerCase().includes('succès') || title.toLowerCase().includes('réussi')) {
      return 'alert-success';
    }
    if (title.toLowerCase().includes('erreur')) {
      return 'alert-error';
    }
    return 'alert-info';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={hide}
      title=""
      modalClassName="sm:max-w-md"
    >
      <div className={`alert ${getAlertClass()} flex-col text-center`}>
        <div>
          <span className="font-bold">{title}</span>
          <p>{message}</p>
        </div>
        <div className="mt-4">
          <Button variant="primary" onClick={handleConfirm} className="w-full">
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertDialog;