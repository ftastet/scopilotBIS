import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  modalClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, modalClassName }) => {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className={`modal-box ${modalClassName || ''}`}>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{children}</div>
        <div className="modal-action">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default Modal;