import { ButtonGroupItem, Dialog, DialogTypes, Type } from '@skiff-org/skiff-ui';
import React from 'react';
import { isMobile } from 'react-device-detect';

interface LogoutModalProps {
  onClose: () => void;
  onLogout: () => void | Promise<void>;
  isOpen: boolean;
  description?: string;
}

const LogoutModal = ({ onClose, onLogout, isOpen, description }: LogoutModalProps) => {
  return (
    <Dialog
      description={description ? description : isMobile ? 'You will need to sign in again.' : ''}
      isMobile={isMobile}
      onClose={onClose}
      open={isOpen}
      title='Logout?'
      type={DialogTypes.Confirm}
    >
      <ButtonGroupItem dataTest='confirm-logout' label='Logout' onClick={onLogout} type={Type.DESTRUCTIVE} />
      <ButtonGroupItem label='Cancel' onClick={onClose} />
    </Dialog>
  );
};

export default LogoutModal;
