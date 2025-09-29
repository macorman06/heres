import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { User } from '../../services/api';

interface UserDetailsDialogProps {
  user: User | null;
  visible: boolean;
  onHide: () => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ user, visible, onHide }) => {
  if (!user) return null;

  const userInitials = `${user.nombre.charAt(0)}${user.apellido1?.charAt(0) || ''}`.toUpperCase();
  const fullName = `${user.nombre} ${user.apellido1 || ''} ${user.apellido2 || ''}`.trim();

  const getRoleBadge = (roleId: number) => {
    const badges = {
      1: { label: 'Superusuario', severity: 'danger' as const },
      2: { label: 'Director', severity: 'danger' as const },
      3: { label: 'Coordinador', severity: 'warning' as const },
      4: { label: 'Animador', severity: 'success' as const },
      5: { label: 'Miembro', severity: 'info' as const }
    };
    return badges[roleId as keyof typeof badges] || { label: 'Usuario', severity: 'secondary' as const };
  };

  const badge = getRoleBadge(user.rol_id);

  return (
    <Dialog
      header="Detalles del Usuario"
      visible={visible}
      style={{ width: '600px' }}
      onHide={onHide}
      modal
    >
      <div className="p-4">
        {/* Header with Avatar and Name */}
        <div className="text-center mb-6">
          <Avatar
            label={userInitials}
            size="xlarge"
            shape="circle"
            className="mb-3 bg-red-500 text-white"
            style={{ width: '6rem', height: '6rem', fontSize: '2rem' }}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {fullName}
          </h2>
          <Badge
            value={badge.label}
            severity={badge.severity}
            className="text-sm"
          />
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Información Personal
            </h3>

            {user.edad && (
              <div className="flex items-center">
                <i className="pi pi-calendar text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Edad:</strong> {user.edad} años
                </span>
              </div>
            )}

            {user.sexo && (
              <div className="flex items-center">
                <i className="pi pi-user text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Sexo:</strong> {user.sexo === 'M' ? 'Masculino' : 'Femenino'}
                </span>
              </div>
            )}

            {user.talla && (
              <div className="flex items-center">
                <i className="pi pi-tag text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Talla:</strong> {user.talla}
                </span>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Información de Contacto
            </h3>

            {user.email && (
              <div className="flex items-center">
                <i className="pi pi-envelope text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {user.email}
                </span>
              </div>
            )}

            {user.telefono && (
              <div className="flex items-center">
                <i className="pi pi-phone text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Teléfono:</strong> {user.telefono}
                </span>
              </div>
            )}

            {user.direccion && (
              <div className="flex items-center">
                <i className="pi pi-home text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Dirección:</strong> {user.direccion}
                </span>
              </div>
            )}

            {user.localidad && (
              <div className="flex items-center">
                <i className="pi pi-map-marker text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Localidad:</strong> {user.localidad}
                </span>
              </div>
            )}
          </div>

          {/* Center Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Centro Juvenil
            </h3>

            {user.centro_juvenil && (
              <div className="flex items-center">
                <i className="pi pi-building text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Centro:</strong> {user.centro_juvenil}
                </span>
              </div>
            )}

            {user.seccion && user.seccion.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <i className="pi pi-users text-gray-600 mr-2"></i>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Secciones:</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.seccion.map((seccion, index) => (
                    <Chip
                      key={index}
                      label={seccion}
                      className="bg-blue-100 text-blue-800"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Información Adicional
            </h3>

            <div className="flex items-center">
              <i className="pi pi-key text-gray-600 mr-2"></i>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Acceso al sistema:</strong> {user.email && user.can_login ? 'Sí' : 'No'}
              </span>
            </div>

            {user.alergias && user.alergias.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <i className="pi pi-exclamation-triangle text-orange-600 mr-2"></i>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Alergias:</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.alergias.map((alergia, index) => (
                    <Chip
                      key={index}
                      label={alergia}
                      className="bg-orange-100 text-orange-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {user.fecha_creacion && (
              <div className="flex items-center">
                <i className="pi pi-clock text-gray-600 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Registrado:</strong> {new Date(user.fecha_creacion).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
