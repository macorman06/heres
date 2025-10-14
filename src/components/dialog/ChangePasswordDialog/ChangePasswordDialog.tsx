// src/components/dialog/ChangePasswordDialog/ChangePasswordDialog.tsx

import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './ChangePasswordDialog.css';

interface ChangePasswordDialogProps {
  visible: boolean;
  userId: number | null;
  onHide: () => void;
  onSuccess: () => void;
  maskClassName?: string;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  visible,
  userId,
  onHide,
  onSuccess,
  maskClassName,
}) => {
  const toast = useRef<Toast>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de usuario no válido',
        life: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
        life: 3000,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña debe tener al menos 6 caracteres',
        life: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${userId}`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contraseña actualizada correctamente',
          life: 3000,
        });
        setNewPassword('');
        setConfirmPassword('');
        onSuccess();
        onHide();
      }
    } catch (error: any) {
      console.error('Error cambiando contraseña:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al cambiar contraseña',
        life: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNewPassword('');
    setConfirmPassword('');
    onHide();
  };

  const dialogHeader = (
    <div className="dialog-header-custom">
      <i className="pi pi-lock" />
      <span>Cambiar Contraseña</span>
    </div>
  );

  const dialogFooter = (
    <div className="dialog-footer-actions">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleCancel}
        className="p-button-secondary"
        disabled={isSaving}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSave}
        className="p-button-primary"
        loading={isSaving}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={dialogHeader}
        visible={visible}
        onHide={handleCancel}
        footer={dialogFooter}
        className="change-password-dialog"
        maskClassName={maskClassName || 'dialog-dark-mask'}
        draggable={false}
        style={{ width: '450px' }}
      >
        <div className="dialog-content">
          <div className="form-field-full">
            <label htmlFor="new-password">
              Nueva Contraseña <span className="required">*</span>
            </label>
            <Password
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              toggleMask
              inputClassName="w-full"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-field-full">
            <label htmlFor="confirm-password">
              Confirmar Contraseña <span className="required">*</span>
            </label>
            <Password
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              feedback={false}
              toggleMask
              inputClassName="w-full"
              placeholder="Repite la contraseña"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
