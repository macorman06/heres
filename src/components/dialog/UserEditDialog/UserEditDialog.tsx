// src/components/dialog/UserEditDialog/UserEditDialog.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import type { Sexo, Talla, CentroJuvenil } from '../../../types/general.types.ts';
import { centroJuvenilOptions, sexoOptions, tallaOptions } from '../../../types/general.types.ts';
import type { User, UserFormData } from '../../../types/user.types.ts';
import { ROLES } from '../../../types/user.types.ts';
import { formatFullName, getUserInitials } from '../../../utils/formatters.ts';
import { ChangePasswordDialog } from '../ChangePasswordDialog/ChangePasswordDialog';
import axios from 'axios';
import './UserEditDialog.css';

interface UserEditDialogProps {
  visible: boolean;
  user: User | null;
  onHide: () => void;
  onSave: () => void;
  maskClassName?: string;
}

interface FormData {
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  birthday: string;
  sexo?: Sexo;
  alergias: string[];
  talla?: Talla;
  centro_juvenil?: CentroJuvenil;
  rol_id: number;
  puntuacion: number;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  visible,
  user,
  onHide,
  onSave,
  maskClassName,
}) => {
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    direccion: '',
    localidad: '',
    birthday: '',
    sexo: undefined,
    alergias: [],
    talla: undefined,
    centro_juvenil: undefined,
    rol_id: ROLES.MIEMBRO,
    puntuacion: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido1: user.apellido1 || '',
        apellido2: user.apellido2 || '',
        email: user.email || '',
        telefono: user.telefono ? user.telefono.replace('+34', '') : '',
        direccion: user.direccion || '',
        localidad: user.localidad || '',
        birthday: user.birthday || '',
        sexo: user.sexo,
        alergias: user.alergias || [],
        talla: user.talla,
        centro_juvenil: user.centro_juvenil,
        rol_id: user.rol_id || ROLES.MIEMBRO,
        puntuacion: user.puntuacion || 0,
      });
      checkProfileImage(user);
    }
  }, [user]);

  const checkProfileImage = async (user: User) => {
    if (!user?.nombre || !user?.apellido1) return;

    const cleanName = (name: string) =>
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    const baseFilename = `${cleanName(user.nombre)}_${cleanName(user.apellido1)}`;
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];

    for (const ext of extensions) {
      const imagePath = `/users/${baseFilename}.${ext}`;
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(null);
          img.onerror = () => reject();
          img.src = imagePath;
        });
        setProfileImage(imagePath);
        return;
      } catch {
        continue;
      }
    }
    setProfileImage(null);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 9);
    const parts = limitedNumbers.match(/.{1,3}/g);
    return parts ? parts.join(' ') : '';
  };

  const extractPhoneNumbers = (formattedPhone: string): string => {
    return formattedPhone.replace(/\D/g, '');
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de usuario no válido',
        life: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const cleanPhoneNumber = extractPhoneNumbers(formData.telefono);

      const updatePayload: Partial<UserFormData> & { puntuacion?: number } = {
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        rol_id: formData.rol_id,
        puntuacion: formData.puntuacion,
      };

      if (cleanPhoneNumber) updatePayload.telefono = `+34${cleanPhoneNumber}`;
      if (formData.direccion) updatePayload.direccion = formData.direccion;
      if (formData.localidad) updatePayload.localidad = formData.localidad;
      if (formData.birthday) updatePayload.birthday = formData.birthday;
      if (formData.sexo) updatePayload.sexo = formData.sexo;
      if (formData.alergias && formData.alergias.length > 0)
        updatePayload.alergias = formData.alergias;
      if (formData.talla) updatePayload.talla = formData.talla;
      if (formData.centro_juvenil) updatePayload.centro_juvenil = formData.centro_juvenil;

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${user.id}`,
        updatePayload,
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
          detail: 'Usuario actualizado correctamente',
          life: 3000,
        });
        onSave();
        onHide();
      }
    } catch (error: any) {
      console.error('Error guardando usuario:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al actualizar usuario',
        life: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const rolOptionsForm = [
    { label: 'Superusuario', value: ROLES.SUPERUSER },
    { label: 'Director', value: ROLES.DIRECTOR },
    { label: 'Coordinador', value: ROLES.COORDINADOR },
    { label: 'Animador', value: ROLES.ANIMADOR },
    { label: 'Miembro', value: ROLES.MIEMBRO },
  ];

  const dialogHeader = (
    <div className="dialog-header-custom">
      <i className="pi pi-user-edit" />
      <span>Editar Usuario</span>
    </div>
  );

  const dialogFooter = (
    <div className="flex gap-2 justify-content-end align-items-center flex-row-reverse">
      <Button
        label="Guardar cambios"
        icon="pi pi-check"
        onClick={handleSave}
        loading={isSaving}
        className="btn-primary"
      />
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="btn-secondary"
        disabled={isSaving}
      />
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={dialogHeader}
        visible={visible}
        onHide={onHide}
        footer={dialogFooter}
        className="user-edit-dialog"
        maskClassName={maskClassName || 'dialog-dark-mask'}
        draggable={false}
        style={{ width: '800px' }}
      >
        <div className="dialog-content">
          {/* Header con Avatar */}
          <div className="user-header">
            {profileImage ? (
              <Avatar image={profileImage} size="xlarge" shape="circle" />
            ) : (
              <Avatar
                label={getUserInitials(user.nombre, user.apellido1)}
                size="xlarge"
                shape="circle"
                style={{ backgroundColor: '#10b981', color: '#ffffff' }}
              />
            )}
            <div className="user-header-info">
              <h3 className="user-name">
                {formatFullName(user.nombre, user.apellido1, user.apellido2)}
              </h3>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          {/* Sección: Información Personal */}
          <div className="form-section">
            <h3 className="section-title">
              <i className="pi pi-user mr-2" />
              Información Personal
            </h3>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="nombre">
                  Nombre <span className="required">*</span>
                </label>
                <InputText
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="form-field">
                <label htmlFor="apellido1">
                  Primer Apellido <span className="required">*</span>
                </label>
                <InputText
                  id="apellido1"
                  value={formData.apellido1}
                  onChange={(e) => handleInputChange('apellido1', e.target.value)}
                  placeholder="Ej: García"
                />
              </div>
              <div className="form-field">
                <label htmlFor="apellido2">Segundo Apellido</label>
                <InputText
                  id="apellido2"
                  value={formData.apellido2}
                  onChange={(e) => handleInputChange('apellido2', e.target.value)}
                  placeholder="Ej: López"
                />
              </div>
              <div className="form-field-full">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <InputText id="email" value={formData.email} disabled className="input-disabled" />
              </div>
              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">+34</span>
                  <InputText
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      handleInputChange('telefono', formatted);
                    }}
                    placeholder="Ej: 612 345 678"
                    maxLength={11}
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="birthday">Fecha de Nacimiento</label>
                <InputText
                  id="birthday"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  type="date"
                />
              </div>
              <div className="form-field">
                <label htmlFor="sexo">Sexo</label>
                <Dropdown
                  id="sexo"
                  value={formData.sexo}
                  options={sexoOptions}
                  onChange={(e) => handleInputChange('sexo', e.value)}
                  placeholder="Selecciona"
                  showClear
                />
              </div>
              <div className="form-field">
                <label htmlFor="talla">Talla de camiseta</label>
                <Dropdown
                  id="talla"
                  value={formData.talla}
                  options={tallaOptions}
                  onChange={(e) => handleInputChange('talla', e.value)}
                  placeholder="Selecciona talla"
                  showClear
                />
              </div>
              <div className="form-field">
                <label htmlFor="direccion">Dirección</label>
                <InputText
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Ej: Calle Mayor 123"
                />
              </div>
              <div className="form-field">
                <label htmlFor="localidad">Localidad</label>
                <InputText
                  id="localidad"
                  value={formData.localidad}
                  onChange={(e) => handleInputChange('localidad', e.target.value)}
                  placeholder="Ej: Madrid"
                />
              </div>
              <div className="form-field">
                <label htmlFor="centro_juvenil">Centro Juvenil</label>
                <Dropdown
                  id="centro_juvenil"
                  value={formData.centro_juvenil}
                  options={centroJuvenilOptions}
                  onChange={(e) => handleInputChange('centro_juvenil', e.value)}
                  placeholder="Selecciona un centro"
                  showClear
                />
              </div>
              <div className="form-field-full">
                <label htmlFor="alergias">Alergias</label>
                <Chips
                  id="alergias"
                  value={formData.alergias}
                  onChange={(e) => handleInputChange('alergias', e.value)}
                  separator=","
                  placeholder="Ej: Polen, Lácteos, Frutos secos..."
                />
                <small className="form-hint">Presiona Enter después de cada alergia</small>
              </div>
            </div>
          </div>

          {/* Sección: Información del Sistema */}
          <div className="form-section">
            <h3 className="section-title">
              <i className="pi pi-cog mr-2" />
              Información del Sistema
            </h3>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="rol_id">Rol</label>
                <Dropdown
                  id="rol_id"
                  value={formData.rol_id}
                  options={rolOptionsForm}
                  onChange={(e) => handleInputChange('rol_id', e.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="puntuacion">Puntuación</label>
                <InputText
                  id="puntuacion"
                  value={formData.puntuacion.toString()}
                  onChange={(e) => handleInputChange('puntuacion', parseInt(e.target.value) || 0)}
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Sección: Cambiar Contraseña */}
          <div className="form-section">
            <h3 className="section-title">
              <i className="pi pi-lock mr-2" />
              Cambiar Contraseña
            </h3>
            <Button
              label="Cambiar contraseña"
              icon="pi pi-key"
              onClick={() => {
                setShowChangePasswordDialog(true);
                onHide();
              }}
              className="p-button-secondary p-button-outlined"
            />
          </div>
        </div>
      </Dialog>

      <ChangePasswordDialog
        visible={showChangePasswordDialog}
        userId={user?.id || null}
        onHide={() => setShowChangePasswordDialog(false)}
        onSuccess={onSave}
        maskClassName={maskClassName}
      />
    </>
  );
};
