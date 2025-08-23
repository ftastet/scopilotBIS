import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  modalClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, modalClassName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen text-center sm:block">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-black/50" onClick={onClose} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        
        <div className={`inline-block align-middle bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:w-full dark:bg-secondary-dark ${modalClassName || 'sm:max-w-lg'}`}>
          <div className="bg-secondary px-4 py-3 sm:px-4 sm:py-3 flex flex-col h-full dark:bg-secondary-dark">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-medium text-text dark:text-text-dark">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-text/60 hover:text-text transition-colors dark:text-text-dark/60 dark:hover:text-text-dark"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;