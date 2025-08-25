import { Modal as FlowbiteModal } from 'flowbite-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: string;
  footer?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, size, footer }: ModalProps) => (
  <FlowbiteModal show={isOpen} onClose={onClose} size={size}>
    <FlowbiteModal.Header>{title}</FlowbiteModal.Header>
    <FlowbiteModal.Body>{children}</FlowbiteModal.Body>
    {footer && <FlowbiteModal.Footer>{footer}</FlowbiteModal.Footer>}
  </FlowbiteModal>
);

export default Modal;
