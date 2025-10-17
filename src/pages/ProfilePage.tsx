// src/pages/ProfilePage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { centroJuvenilOptions, User } from '../types';
import type { Sexo, Talla, CentroJuvenil } from '../types';
import { TokenManager } from '../services/auth/tokenManager';
import { formatFullName } from '../utils/formatters';
import { userService } from '../services/api/index';
import { avatarCache } from '../utils/avatarCache';

interface ProfileFormData {
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  birthday: Date | null;
  sexo: Sexo | '';
  alergias: string[];
  talla: Talla | '';
  centro_juvenil: CentroJuvenil | '';
}

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useRef<Toast>(null);

  // Estados
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [edad, setEdad] = useState<number | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    direccion: '',
    localidad: '',
    birthday: null,
    sexo: '',
    alergias: [],
    talla: '',
    centro_juvenil: '',
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

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
        birthday: user.birthday ? new Date(user.birthday) : null,
        sexo: user.sexo || '',
        alergias: user.alergias || [],
        talla: user.talla || '',
        centro_juvenil: user.centro_juvenil || '',
      });

      // Calcular edad
      if (user.birthday) {
        const birthDate = new Date(user.birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setEdad(age);
      }
    }
  }, [user]);

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 9);
    const parts = limitedNumbers.match(/.{1,3}/g);
    return parts ? parts.join(' ') : '';
  };

  const extractPhoneNumbers = (formattedPhone: string): string => {
    return formattedPhone.replace(/\D/g, '');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'birthday' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setEdad(age);
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ ACTUALIZADO: Subir avatar e invalidar caché
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten archivos PNG, JPG, JPEG o WEBP',
        life: 3000,
      });
      return;
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El archivo no puede superar 5MB',
        life: 3000,
      });
      return;
    }

    try {
      await userService.uploadAvatar(userId, file);
      avatarCache.remove(userId); // ✅ Invalidar caché

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: '✅ Foto de perfil actualizada correctamente',
        life: 3000,
      });
    } catch (error: any) {
      console.error('Error subiendo avatar:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || '❌ Error al subir la foto de perfil',
        life: 5000,
      });
    } finally {
      // Limpiar input
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = TokenManager.getToken();
      const cleanPhoneNumber = extractPhoneNumbers(formData.telefono);

      const updatePayload: any = {
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        email: formData.email,
      };

      if (cleanPhoneNumber) updatePayload.telefono = `+34${cleanPhoneNumber}`;
      if (formData.direccion) updatePayload.direccion = formData.direccion;
      if (formData.localidad) updatePayload.localidad = formData.localidad;
      if (formData.birthday) updatePayload.birthday = formData.birthday.toISOString().split('T')[0];
      if (formData.sexo) updatePayload.sexo = formData.sexo;
      if (formData.alergias && formData.alergias.length > 0)
        updatePayload.alergias = formData.alergias;
      if (formData.talla) updatePayload.talla = formData.talla;
      if (formData.centro_juvenil) updatePayload.centro_juvenil = formData.centro_juvenil;

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: '✅ Perfil actualizado correctamente',
          life: 3000,
        });

        if (user) {
          const updatedUser: User = {
            ...user,
            ...updatePayload,
            telefono: cleanPhoneNumber ? `+34${cleanPhoneNumber}` : user.telefono,
          };
          updateUser(updatedUser);
        }
      }
    } catch (error: any) {
      console.error('Error guardando perfil:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || '❌ Error al actualizar el perfil',
        life: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido1: user.apellido1 || '',
        apellido2: user.apellido2 || '',
        email: user.email || '',
        telefono: user.telefono ? user.telefono.replace('+34', '') : '',
        direccion: user.direccion || '',
        localidad: user.localidad || '',
        birthday: user.birthday ? new Date(user.birthday) : null,
        sexo: user.sexo || '',
        alergias: user.alergias || [],
        talla: user.talla || '',
        centro_juvenil: user.centro_juvenil || '',
      });

      toast.current?.show({
        severity: 'info',
        summary: 'Cancelado',
        detail: 'Cambios descartados',
        life: 2000,
      });
    }
  };

  const handleChangePassword = async () => {
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

    setIsChangingPassword(true);
    try {
      const token = TokenManager.getToken();
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`,
        { password: passwordData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: '✅ Contraseña actualizada correctamente. Cerrando sesión...',
          life: 3000,
        });

        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordDialog(false);

        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (error: any) {
      console.error('❌ Error cambiando contraseña:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || '❌ Error al cambiar la contraseña',
        life: 5000,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      superuser: { label: 'Superusuario', severity: 'danger' as const },
      director: { label: 'Director', severity: 'danger' as const },
      coordinador: { label: 'Coordinador', severity: 'warning' as const },
      animador: { label: 'Animador', severity: 'success' as const },
      miembro: { label: 'Miembro', severity: 'info' as const },
    };

    return (
      badges[role?.toLowerCase() as keyof typeof badges] || {
        label: 'Usuario',
        severity: 'info' as const,
      }
    );
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const roleBadge = getRoleBadge(user.rol || 'miembro');

  const sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
  ];

  const tallaOptions = [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
    { label: 'XXL', value: 'XXL' },
  ];

  return (
    <div className="profile-page">
      <Toast ref={toast} />

      {/* Header con Avatar */}
      <Card className="profile-header-card mb-4">
        <div className="flex align-items-center gap-4">
          {/* ✅ Usar componente UserAvatar */}
          <div className="relative">
            <UserAvatar
              userId={user.id}
              nombre={user.nombre}
              apellido={user.apellido1}
              size="large"
            />

            {/* Botón para cambiar foto */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-upload">
              <Button
                icon="pi pi-camera"
                className="p-button-rounded p-button-sm"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  color: '#6366f1',
                  border: '2px solid #6366f1',
                }}
                tooltip="Cambiar foto de perfil"
                tooltipOptions={{ position: 'bottom' }}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              />
            </label>
          </div>

          {/* Información del usuario */}
          <div className="flex-1">
            <h2 className="m-0 mb-2">
              {formatFullName(user.nombre, user.apellido1, user.apellido2)}
            </h2>
            <p className="text-600 m-0 mb-2">{user.email}</p>
            <div className="flex gap-2 align-items-center">
              <Badge value={roleBadge.label} severity={roleBadge.severity} />
              {user.puntuacion !== undefined && (
                <Badge value={`${user.puntuacion} pts`} severity="success" />
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
      <Card className="mb-4">
        <div className="card-header mb-4">
          <h3 className="text-xl font-semibold m-0 mb-2">Información Personal</h3>
          <p className="text-600 m-0">Actualiza tus datos personales y de contacto</p>
        </div>

        <div className="grid">
          {/* Nombre */}
          <div className="col-12 md:col-6">
            <label htmlFor="nombre" className="block mb-2 font-semibold">
              Nombre *
            </label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Juan"
              className="w-full"
            />
          </div>

          {/* Primer Apellido */}
          <div className="col-12 md:col-6">
            <label htmlFor="apellido1" className="block mb-2 font-semibold">
              Primer Apellido *
            </label>
            <InputText
              id="apellido1"
              value={formData.apellido1}
              onChange={(e) => handleInputChange('apellido1', e.target.value)}
              placeholder="Ej: García"
              className="w-full"
            />
          </div>

          {/* Segundo Apellido */}
          <div className="col-12 md:col-6">
            <label htmlFor="apellido2" className="block mb-2 font-semibold">
              Segundo Apellido
            </label>
            <InputText
              id="apellido2"
              value={formData.apellido2}
              onChange={(e) => handleInputChange('apellido2', e.target.value)}
              placeholder="Ej: López"
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="col-12 md:col-6">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email *
            </label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ej: juan.garcia@email.com"
              className="w-full"
            />
          </div>

          {/* Teléfono */}
          <div className="col-12 md:col-6">
            <label htmlFor="telefono" className="block mb-2 font-semibold">
              Teléfono
            </label>
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
                className="w-full"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="col-12 md:col-6">
            <label htmlFor="direccion" className="block mb-2 font-semibold">
              Dirección
            </label>
            <InputText
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Ej: Calle Mayor 123"
              className="w-full"
            />
          </div>

          {/* Localidad */}
          <div className="col-12 md:col-6">
            <label htmlFor="localidad" className="block mb-2 font-semibold">
              Localidad
            </label>
            <InputText
              id="localidad"
              value={formData.localidad}
              onChange={(e) => handleInputChange('localidad', e.target.value)}
              placeholder="Ej: Madrid"
              className="w-full"
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div className="col-12 md:col-6">
            <label htmlFor="birthday" className="block mb-2 font-semibold">
              Fecha de Nacimiento
              {edad !== null && <Badge value={`${edad} años`} severity="info" className="ml-2" />}
            </label>
            <Calendar
              id="birthday"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              className="w-full"
              placeholder="Selecciona una fecha"
            />
          </div>

          {/* Sexo */}
          <div className="col-12 md:col-6">
            <label htmlFor="sexo" className="block mb-2 font-semibold">
              Sexo
            </label>
            <Dropdown
              id="sexo"
              value={formData.sexo}
              options={sexoOptions}
              onChange={(e) => handleInputChange('sexo', e.value)}
              placeholder="Selecciona"
              className="w-full"
            />
          </div>

          {/* Talla */}
          <div className="col-12 md:col-6">
            <label htmlFor="talla" className="block mb-2 font-semibold">
              Talla de camiseta
            </label>
            <Dropdown
              id="talla"
              value={formData.talla}
              options={tallaOptions}
              onChange={(e) => handleInputChange('talla', e.value)}
              placeholder="Selecciona talla"
              className="w-full"
            />
          </div>

          {/* Centro Juvenil */}
          <div className="col-12 md:col-6">
            <label htmlFor="centro" className="block mb-2 font-semibold">
              Centro Juvenil
            </label>
            <Dropdown
              id="centro"
              value={formData.centro_juvenil}
              options={centroJuvenilOptions}
              onChange={(e) => handleInputChange('centro_juvenil', e.value)}
              placeholder="Selecciona un centro"
              className="w-full"
            />
          </div>

          {/* Alergias */}
          <div className="col-12">
            <label htmlFor="alergias" className="block mb-2 font-semibold">
              Alergias
            </label>
            <Chips
              id="alergias"
              value={formData.alergias}
              onChange={(e) => handleInputChange('alergias', e.value)}
              separator=","
              placeholder="Ej: Polen, Lácteos, Frutos secos..."
              className="w-full"
            />
            <small className="text-600">Presiona Enter después de cada alergia</small>
          </div>
        </div>
      </Card>

      {/* SECCIÓN 2: INFORMACIÓN DEL SISTEMA */}
      <Card className="mb-4">
        <div className="card-header mb-4">
          <h3 className="text-xl font-semibold m-0 mb-2">Información del Sistema</h3>
          <p className="text-600 m-0">Datos gestionados por el administrador del sistema</p>
        </div>

        <div className="grid">
          {/* Rol */}
          <div className="col-12 md:col-4">
            <label className="block mb-2 font-semibold">Rol</label>
            <Badge value={roleBadge.label} severity={roleBadge.severity} />
          </div>

          {/* Puntuación */}
          <div className="col-12 md:col-4">
            <label className="block mb-2 font-semibold">Puntuación</label>
            <Badge value={`${user.puntuacion || 0} puntos`} severity="success" />
          </div>

          {/* Sección */}
          <div className="col-12 md:col-4">
            <label className="block mb-2 font-semibold">Sección</label>
            <div className="flex gap-2 flex-wrap">
              {user.seccion && Array.isArray(user.seccion) && user.seccion.length > 0 ? (
                user.seccion.map((sec: string, idx: number) => (
                  <Chip key={idx} label={sec} className="mr-2" />
                ))
              ) : (
                <span className="text-600">No asignada</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* SECCIÓN 3: ZONA DE RIESGO */}
      <Card className="mb-4 border-danger">
        <div className="card-header mb-4">
          <h3 className="text-xl font-semibold m-0 mb-2 text-danger">Zona de Riesgo</h3>
          <p className="text-600 m-0">Gestiona la seguridad de tu cuenta</p>
        </div>

        <Button
          label="Cambiar Contraseña"
          icon="pi pi-lock"
          onClick={() => setShowPasswordDialog(true)}
          severity="danger"
          outlined
        />
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-content-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={handleCancel}
          severity="secondary"
          outlined
        />
        <Button
          label="Guardar Cambios"
          icon="pi pi-check"
          onClick={handleSave}
          loading={isSaving}
        />
      </div>

      {/* DIÁLOGO DE CAMBIO DE CONTRASEÑA */}
      <Dialog
        header="Cambiar Contraseña"
        visible={showPasswordDialog}
        style={{ width: '400px' }}
        onHide={() => {
          setShowPasswordDialog(false);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        modal
        draggable={false}
        resizable={false}
      >
        <div className="flex flex-column gap-4">
          <div className="field">
            <label htmlFor="newPassword" className="block mb-2 font-semibold">
              Nueva Contraseña
            </label>
            <Password
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              toggleMask
              className="w-full"
              inputClassName="w-full"
              promptLabel="Ingresa una contraseña"
              weakLabel="Débil"
              mediumLabel="Media"
              strongLabel="Fuerte"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
              Confirmar Contraseña
            </label>
            <Password
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
              inputClassName="w-full"
              placeholder="Repite la contraseña"
            />
          </div>

          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
              }}
              severity="secondary"
              outlined
            />
            <Button
              label="Cambiar"
              icon="pi pi-check"
              onClick={handleChangePassword}
              loading={isChangingPassword}
              severity="danger"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
