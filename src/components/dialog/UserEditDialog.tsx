// src/components/dialog/UserEditDialog.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';
import { Password } from 'primereact/password';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import type { Sexo, Talla, CentroJuvenil } from '../../types/general.types';
import { centroJuvenilOptions, sexoOptions, tallaOptions } from '../../types/general.types';
import type { User, UserFormData } from '../../types/user.types';
import { ROLES } from '../../types/user.types';
import { formatFullName, getUserInitials } from '../../utils/formatters';
import axios from 'axios';
import './UserEditDialog.css';

// ========================================
// INTERFACES
// ========================================
interface UserEditDialogProps {
  visible: boolean;
  user: User | null;
  onHide: () => void;
  onSave: () => void;
  maskClassName?: string; // ✅ AÑADIDA
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

// ========================================
// COMPONENT
// ========================================
export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  visible,
  user,
  onHide,
  onSave,
  maskClassName, // ✅ DESESTRUCTURADA
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
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // ========================================
  // EFFECTS
  // ========================================
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
      setShowPasswordSection(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
  }, [user]);

  // ========================================
  // HANDLERS
  // ========================================
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
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
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
        detail: '❌ ID de usuario no válido',
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
          detail: '✅ Usuario actualizado correctamente',
          life: 3000,
        });
        onSave();
        onHide();
      }
    } catch (error: any) {
      console.error('❌ Error guardando usuario:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:
          error.response?.data?.error ||
          error.response?.data?.msg ||
          '❌ Error al actualizar usuario',
        life: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
        life: 3000,
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña debe tener al menos 6 caracteres',
        life: 3000,
      });
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${user.id}`,
        { password: passwordData.newPassword },
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
          detail: '✅ Contraseña actualizada correctamente',
          life: 3000,
        });
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
      }
    } catch (error: any) {
      console.error('Error cambiando contraseña:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || '❌ Error al cambiar contraseña',
        life: 5000,
      });
    }
  };

  const getRoleBadge = (rolId: number) => {
    const badges: Record<number, { label: string; severity: string }> = {
      [ROLES.SUPERUSER]: { label: 'Superusuario', severity: 'danger' },
      [ROLES.DIRECTOR]: { label: 'Director', severity: 'danger' },
      [ROLES.COORDINADOR]: { label: 'Coordinador', severity: 'warning' },
      [ROLES.ANIMADOR]: { label: 'Animador', severity: 'success' },
      [ROLES.MIEMBRO]: { label: 'Miembro', severity: 'info' },
    };
    return badges[rolId] || { label: 'Usuario', severity: 'info' };
  };

  const rolOptionsForm = [
    { label: 'Superusuario', value: ROLES.SUPERUSER },
    { label: 'Director', value: ROLES.DIRECTOR },
    { label: 'Coordinador', value: ROLES.COORDINADOR },
    { label: 'Animador', value: ROLES.ANIMADOR },
    { label: 'Miembro', value: ROLES.MIEMBRO },
  ];

  const dialogFooter = (
    <div
      className="flex gap-2 justify-content-end align-items-end"
      style={{ marginTop: 'auto', paddingTop: '1.5rem' }}
    >
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-outlined p-button-secondary"
      />
      <Button
        label="Guardar Cambios"
        icon="pi pi-check"
        onClick={handleSave}
        loading={isSaving}
        className="btn-primary"
      />
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Editar Usuario"
        footer={dialogFooter}
        style={{ width: '50rem' }}
        className="user-edit-dialog"
        modal
        draggable={false}
        resizable={false}
        maskClassName={maskClassName} // ✅ AÑADIDA LA PROP
      >
        <div className="user-edit-content">
          {/* Header con Avatar */}
          <div className="user-header">
            <div>
              {profileImage ? (
                <Avatar image={profileImage} size="xlarge" shape="circle" />
              ) : (
                <Avatar
                  label={getUserInitials(user.nombre, user.apellido1)}
                  size="xlarge"
                  shape="circle"
                  style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}
                />
              )}
            </div>
            <div>
              <h2 className="user-name">
                {formatFullName(user.nombre, user.apellido1, user.apellido2)}
              </h2>
              <p className="user-email">{user.email}</p>
              <Badge
                value={getRoleBadge(user.rol_id).label}
                severity={getRoleBadge(user.rol_id).severity as any}
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          </div>

          <hr className="divider" />

          {/* Información Personal */}
          <h3 className="section-title">Información Personal</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Nombre *</label>
              <InputText
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full"
                placeholder="Ej: Juan"
              />
            </div>
            <div className="form-field">
              <label>Primer Apellido *</label>
              <InputText
                value={formData.apellido1}
                onChange={(e) => handleInputChange('apellido1', e.target.value)}
                className="w-full"
                placeholder="Ej: García"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Segundo Apellido</label>
            <InputText
              value={formData.apellido2}
              onChange={(e) => handleInputChange('apellido2', e.target.value)}
              className="w-full"
              placeholder="Ej: López"
            />
          </div>

          <div className="form-field">
            <label>Email *</label>
            <InputText value={formData.email} className="w-full" disabled />
          </div>

          <div className="form-field">
            <label>Teléfono</label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">+34</span>
              <InputText
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
            <label>Fecha de Nacimiento</label>
            <InputText
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              type="date"
              className="w-full"
            />
          </div>

          <div className="form-field">
            <label>Sexo</label>
            <Dropdown
              value={formData.sexo}
              options={sexoOptions}
              onChange={(e) => handleInputChange('sexo', e.value)}
              placeholder="Selecciona"
              className="w-full"
              showClear
            />
          </div>

          <div className="form-field">
            <label>Talla de camiseta</label>
            <Dropdown
              value={formData.talla}
              options={tallaOptions}
              onChange={(e) => handleInputChange('talla', e.value)}
              placeholder="Selecciona talla"
              className="w-full"
              showClear
            />
          </div>

          <div className="form-field">
            <label>Dirección</label>
            <InputText
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              className="w-full"
              placeholder="Ej: Calle Mayor 123"
            />
          </div>

          <div className="form-field">
            <label>Localidad</label>
            <InputText
              value={formData.localidad}
              onChange={(e) => handleInputChange('localidad', e.target.value)}
              className="w-full"
              placeholder="Ej: Madrid"
            />
          </div>

          <div className="form-field">
            <label>Centro Juvenil</label>
            <Dropdown
              value={formData.centro_juvenil}
              options={centroJuvenilOptions}
              onChange={(e) => handleInputChange('centro_juvenil', e.value)}
              placeholder="Selecciona un centro"
              className="w-full"
              showClear
            />
          </div>

          <div className="form-field-full">
            <label>Alergias</label>
            <Chips
              value={formData.alergias}
              onChange={(e) => handleInputChange('alergias', e.value)}
              separator=","
              placeholder="Ej: Polen, Lácteos, Frutos secos..."
              className="w-full"
            />
            <small className="text-500">Presiona Enter después de cada alergia</small>
          </div>

          <hr className="divider" />

          {/* Información del Sistema */}
          <h3 className="section-title">Información del Sistema</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Rol</label>
              <Dropdown
                value={formData.rol_id}
                options={rolOptionsForm}
                onChange={(e) => handleInputChange('rol_id', e.value)}
                className="w-full"
              />
            </div>
            <div className="form-field">
              <label>Puntuación</label>
              <InputText
                value={formData.puntuacion.toString()}
                onChange={(e) => handleInputChange('puntuacion', parseInt(e.target.value) || 0)}
                className="w-full"
                type="number"
              />
            </div>
          </div>

          <hr className="divider" />

          {/* Cambiar Contraseña */}
          <h3 className="section-title">Cambiar Contraseña</h3>
          {!showPasswordSection ? (
            <Button
              label="Cambiar Contraseña"
              icon="pi pi-key"
              onClick={() => setShowPasswordSection(true)}
              className="btn-primary"
            />
          ) : (
            <div className="form-row">
              <div className="form-field">
                <label>Nueva Contraseña</label>
                <Password
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  toggleMask
                  className="w-full"
                  inputClassName="w-full"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="form-field">
                <label>Confirmar Contraseña</label>
                <Password
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  feedback={false}
                  toggleMask
                  className="w-full"
                  inputClassName="w-full"
                  placeholder="Repite la contraseña"
                />
              </div>
              <div className="form-field-full">
                <div className="flex gap-2">
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setPasswordData({ newPassword: '', confirmPassword: '' });
                    }}
                    className="p-button-outlined p-button-secondary"
                  />
                  <Button
                    label="Guardar Contraseña"
                    icon="pi pi-check"
                    onClick={handleChangePassword}
                    className="btn-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};
