// src/components/common/UserDetailsDialog.tsx
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { User } from '../../services/api';

interface UserDetailsDialogProps {
  visible: boolean;
  user?: User | null;
  onHide: () => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
                                                                      visible,
                                                                      user,
                                                                      onHide
                                                                    }) => {
  if (!user) return null;

  const getRoleBadge = (roleId: number) => {
    const roleMap = {
      1: { label: 'Superusuario', severity: 'danger' as const },
      2: { label: 'Director', severity: 'danger' as const },
      3: { label: 'Coordinador', severity: 'warning' as const },
      4: { label: 'Animador', severity: 'success' as const },
      5: { label: 'Miembro', severity: 'info' as const }
    };
    return roleMap[roleId as keyof typeof roleMap] || { label: 'Usuario', severity: 'info' as const };
  };

  const roleBadge = getRoleBadge(user.rol_id || 5);

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Detalles de ${user.nombre} ${user.apellido1}`}
      modal
      style={{ width: '500px' }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700">Nombre:</label>
            <p>{user.nombre}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Apellidos:</label>
            <p>{`${user.apellido1 || ''} ${user.apellido2 || ''}`.trim()}</p>
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Email:</label>
          <p>{user.email || 'No especificado'}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Rol:</label>
          <div className="mt-1">
            <Badge value={roleBadge.label} severity={roleBadge.severity} />
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Centro Juvenil:</label>
          <p>{user.centro_juvenil || 'No especificado'}</p>
        </div>

        {user.edad && (
          <div>
            <label className="font-semibold text-gray-700">Edad:</label>
            <p>{user.edad} años</p>
          </div>
        )}

        <div>
          <label className="font-semibold text-gray-700">Puede iniciar sesión:</label>
          <p className={user.can_login ? 'text-green-600' : 'text-red-600'}>
            {user.can_login ? 'Sí' : 'No'}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          onClick={onHide}
        />
      </div>
    </Dialog>
  );
};
