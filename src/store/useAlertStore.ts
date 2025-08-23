import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
}

interface AlertActions {
  show: (title: string, message: string, onConfirm?: () => void) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState & AlertActions>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: undefined,

  show: (title: string, message: string, onConfirm?: () => void) => {
    set({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  },

  hide: () => {
    set({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: undefined,
    });
  },
}));