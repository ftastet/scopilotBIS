import { Alert } from 'flowbite-react';
import Modal from './Modal';
import Button from './Button';
import { useAlertStore } from '../../store/useAlertStore';

const AlertDialog = () => {
  const { isOpen, title, message, onConfirm, hide } = useAlertStore();

  const handleConfirm = () => {
    hide();
    onConfirm?.();
  };

  const getColor = (): 'info' | 'success' | 'failure' => {
    const t = title.toLowerCase();
    if (t.includes('succès') || t.includes('réussi')) return 'success';
    if (t.includes('erreur')) return 'failure';
    return 'info';
  };

  return (
    <Modal isOpen={isOpen} onClose={hide} title="">
      <div className="space-y-4">
        <Alert color={getColor()}>{message}</Alert>
        <div className="text-center">
          <Button color="blue" onClick={handleConfirm} className="w-full">
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertDialog;
