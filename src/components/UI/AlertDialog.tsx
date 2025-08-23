import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
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

  const getIcon = () => {
    if (title.toLowerCase().includes('succès') || title.toLowerCase().includes('réussi')) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    if (title.toLowerCase().includes('erreur')) {
      return <AlertCircle className="h-6 w-6 text-red-600" />;
    }
    return <Info className="h-6 w-6 text-blue-600" />;
  };

  const getIconBgColor = () => {
    if (title.toLowerCase().includes('succès') || title.toLowerCase().includes('réussi')) {
      return 'bg-green-100';
    }
    if (title.toLowerCase().includes('erreur')) {
      return 'bg-red-100';
    }
    return 'bg-blue-100';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={hide}
      title=""
      modalClassName="sm:max-w-md"
    >
      <div className="text-center space-y-4">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${getIconBgColor()}`}>
          {getIcon()}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-text dark:text-background">
            {title}
          </h3>
          <p className="text-sm text-text/60 dark:text-background/60">
            {message}
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="w-full"
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertDialog;