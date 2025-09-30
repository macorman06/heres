// src/components/common/UserFormDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { User, RegisterData } from '../../services/api';

interface UserFormDialogProps {
  visible: boolean;
  user?: User | null;
  viewMode?: boolean;
  onHide: () => void;
  onSave?: (data: RegisterData) => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
                                                                visible,
                                                                user = null,  // ✅ Default value para evitar undefined
                                                                viewMode = false,
                                                                onHide,
                                                                onSave
                                                              }) => {
  // ✅ Estado del formulario con valores por defecto
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    password: ''
  });

  // ✅ Cargar datos del usuario cuando se abre el diálogo
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',  // ✅ Fallback a string vacío
        apellido1: user.apellido1 || '',
        apellido2: user.apellido2 || '',
        email: user.email || '',
        password: '' // No cargar password por seguridad
      });
    } else {
      // Resetear formulario para nuevo usuario
      setFormData({
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        password: ''
      });
    }
  }, [user]);

  // ✅ Handler para cambios en los campos
  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ Handler para guardar
  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  // ✅ Opciones para dropdown de rol
  const roleOptions = [
    { label: 'Superusuario', value: 1 },
    { label: 'Director', value: 2 },
    { label: 'Coordinador', value: 3 },
    { label: 'Animador', value: 4 },
    { label: 'Miembro', value: 5 }
  ];

  const dialogTitle = viewMode
    ? `Ver Usuario: ${user?.nombre || 'Desconocido'}`
    : user
      ? `Editar Usuario: ${user.nombre || 'Desconocido'}`
      : 'Nuevo Usuario';

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={dialogTitle}
      modal
      className="p-fluid"
      style={{ width: '500px' }}
    >
      <div className="grid gap-4">
        {/* Nombre */}
        <div className="field">
          <label htmlFor="nombre" className="font-semibold">
            Nombre *
          </label>
          <InputText
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            disabled={viewMode}
            required
          />
        </div>

        {/* Apellido 1 */}
        <div className="field">
          <label htmlFor="apellido1" className="font-semibold">
            Primer Apellido
          </label>
          <InputText
            id="apellido1"
            value={formData.apellido1}
            onChange={(e) => handleChange('apellido1', e.target.value)}
            disabled={viewMode}
          />
        </div>

        {/* Apellido 2 */}
        <div className="field">
          <label htmlFor="apellido2" className="font-semibold">
            Segundo Apellido
          </label>
          <InputText
            id="apellido2"
            value={formData.apellido2}
            onChange={(e) => handleChange('apellido2', e.target.value)}
            disabled={viewMode}
          />
        </div>

        {/* Email */}
        <div className="field">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <InputText
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={viewMode}
          />
        </div>

        {/* Password (solo para nuevo usuario o edición) */}
        {!viewMode && (
          <div className="field">
            <label htmlFor="password" className="font-semibold">
              {user ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
            </label>
            <InputText
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required={!user} // Requerido solo para nuevo usuario
            />
          </div>
        )}

        {/* Información adicional si es viewMode */}
        {viewMode && user && (
          <>
            <div className="field">
              <label className="font-semibold">Rol</label>
              <p className="text-gray-700 dark:text-gray-300">
                {user.rol || 'No especificado'}
              </p>
            </div>
            <div className="field">
              <label className="font-semibold">Centro Juvenil</label>
              <p className="text-gray-700 dark:text-gray-300">
                {user.centro_juvenil || 'No especificado'}
              </p>
            </div>
            {user.edad && (
              <div className="field">
                <label className="font-semibold">Edad</label>
                <p className="text-gray-700 dark:text-gray-300">{user.edad} años</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-6">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-text"
          onClick={onHide}
        />
        {!viewMode && (
          <Button
            label={user ? 'Actualizar' : 'Crear'}
            icon="pi pi-check"
            onClick={handleSave}
            disabled={!formData.nombre || (!user && !formData.password)}
          />
        )}
      </div>
    </Dialog>
  );
};
