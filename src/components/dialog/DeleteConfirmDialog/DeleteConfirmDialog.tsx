import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface DeleteConfirmDialogProps {
  visible: boolean;
  itemName: string;
  onHide: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  visible,
  itemName,
  onHide,
  onConfirm,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onHide();
    } catch (error) {
      console.error('Error eliminando:', error);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex gap-2 justify-content-end align-items-center flex-row-reverse">
      <Button
        label="Eliminar"
        icon="pi pi-trash"
        onClick={handleConfirm}
        loading={loading}
        className="btn-primary"
      />
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="btn-secondary" />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Confirmar eliminación"
      footer={footer}
      style={{ width: '450px' }}
      modal
      maskClassName="dialog-dark-mask"
    >
      <div className="flex align-items-center">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: '2rem', color: 'var(--red-500)' }}
        />
        <div>
          <p>¿Estás seguro de que deseas eliminar esta actividad?</p>
          <p className="font-bold mt-2">{itemName}</p>
          <p className="text-sm text-gray-600 mt-2">Esta acción no se puede deshacer.</p>
        </div>
      </div>
    </Dialog>
  );
};
