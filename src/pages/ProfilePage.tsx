// ProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Message } from 'primereact/message';
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

// Interface para el formulario
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
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

      checkProfileImage();
    }
  }, [user]);

  const cleanName = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 9);
    const parts = limitedNumbers.match(/.{1,3}/g);
    return parts ? parts.join(' ') : '';
  };

  const extractPhoneNumbers = (formattedPhone: string): string => {
    return formattedPhone.replace(/\D/g, '');
  };

  const checkProfileImage = async () => {
    if (!user?.nombre || !user?.apellido1) return;

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
        // Continue to next extension
      }
    }
    setProfileImage(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Recalcular edad si cambia birthday
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

      if (cleanPhoneNumber) {
        updatePayload.telefono = `+34${cleanPhoneNumber}`;
      }

      if (formData.direccion) {
        updatePayload.direccion = formData.direccion;
      }

      if (formData.localidad) {
        updatePayload.localidad = formData.localidad;
      }

      if (formData.birthday) {
        updatePayload.birthday = formData.birthday.toISOString().split('T')[0];
      }

      if (formData.sexo) {
        updatePayload.sexo = formData.sexo;
      }

      if (formData.alergias && formData.alergias.length > 0) {
        updatePayload.alergias = formData.alergias;
      }

      if (formData.talla) {
        updatePayload.talla = formData.talla;
      }

      if (formData.centro_juvenil) {
        updatePayload.centro_juvenil = formData.centro_juvenil;
      }

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
            nombre: formData.nombre,
            apellido1: formData.apellido1,
            apellido2: formData.apellido2,
            email: formData.email,
            telefono: cleanPhoneNumber ? `+34${cleanPhoneNumber}` : user.telefono,
            direccion: formData.direccion || user.direccion,
            localidad: formData.localidad || user.localidad,
            birthday: formData.birthday
              ? formData.birthday.toISOString().split('T')[0]
              : user.birthday,
            sexo: formData.sexo || undefined,
            alergias: formData.alergias.length > 0 ? formData.alergias : user.alergias,
            talla: formData.talla || undefined,
            centro_juvenil: formData.centro_juvenil || undefined,
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

      if (!token) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: '❌ No hay token de autenticación. Por favor, inicia sesión nuevamente.',
          life: 5000,
        });
        setIsChangingPassword(false);
        return;
      }

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

      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        '❌ Error al cambiar la contraseña';

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
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
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
      </div>
    );
  }

  const userInitials = user.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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

      <Card className="shadow-3">
        {/* Header con Avatar a la izquierda */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar grande */}
          <div style={{ flexShrink: 0 }}>
            {profileImage ? (
              <Avatar image={profileImage} shape="circle" className="profile-avatar-hero" />
            ) : (
              <Avatar label={userInitials} shape="circle" className="profile-avatar-hero" />
            )}
          </div>

          {/* Información del usuario */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              minWidth: '0',
            }}
          >
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 0.5rem 0',
                color: 'var(--text-primary)',
                lineHeight: '1.2',
              }}
            >
              {formatFullName(user.nombre, user.apellido1, user.apellido2)}
            </h1>

            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--text-muted)',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="pi pi-envelope" style={{ fontSize: '1rem' }}></i>
              {user.email}
            </p>
          </div>
        </div>

        {/* Línea divisoria completa */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <i className="pi pi-user" style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}></i>
              Información Personal
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                marginLeft: '2.25rem',
                marginTop: '0',
              }}
            >
              Actualiza tus datos personales y de contacto
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
            {/* Nombre */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="nombre">Nombre *</label>
              <InputText
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Juan"
              />
            </div>

            {/* Primer Apellido */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="apellido1">Primer Apellido *</label>
              <InputText
                id="apellido1"
                value={formData.apellido1}
                onChange={(e) => handleInputChange('apellido1', e.target.value)}
                placeholder="Ej: García"
              />
            </div>

            {/* Segundo Apellido */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="apellido2">Segundo Apellido</label>
              <InputText
                id="apellido2"
                value={formData.apellido2}
                onChange={(e) => handleInputChange('apellido2', e.target.value)}
                placeholder="Ej: López"
              />
            </div>

            {/* Email */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="email">Email *</label>
              <InputText
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ej: juan.garcia@email.com"
              />
            </div>

            {/* Teléfono */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
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

            {/* Dirección */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="direccion">Dirección</label>
              <InputText
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Ej: Calle Mayor 123"
              />
            </div>

            {/* Localidad */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="localidad">Localidad</label>
              <InputText
                id="localidad"
                value={formData.localidad}
                onChange={(e) => handleInputChange('localidad', e.target.value)}
                placeholder="Ej: Madrid"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="birthday">
                Fecha de Nacimiento
                {edad !== null && (
                  <Chip label={`${edad} años`} className="ml-2" style={{ height: '24px' }} />
                )}
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
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="sexo">Sexo</label>
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
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="talla">Talla de camiseta</label>
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
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label htmlFor="centro_juvenil">Centro Juvenil</label>
              <Dropdown
                id="centro_juvenil"
                value={formData.centro_juvenil}
                options={centroJuvenilOptions}
                onChange={(e) => handleInputChange('centro_juvenil', e.value)}
                placeholder="Selecciona un centro"
                className="w-full"
              />
            </div>

            {/* Alergias */}
            <div className="field" style={{ flex: '1 1 100%', width: '100%' }}>
              <label htmlFor="alergias">Alergias</label>
              <Chips
                id="alergias"
                value={formData.alergias}
                onChange={(e) => handleInputChange('alergias', e.value)}
                separator=","
                placeholder="Ej: Polen, Lácteos, Frutos secos..."
              />
              <small className="text-muted">Presiona Enter después de cada alergia</small>
            </div>
          </div>
        </div>

        {/* Línea divisoria completa */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        {/* SECCIÓN 2: INFORMACIÓN DEL SISTEMA */}
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <i
                className="pi pi-shield"
                style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}
              ></i>
              Información del Sistema
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                marginLeft: '2.25rem',
                marginTop: '0',
              }}
            >
              Datos gestionados por el administrador del sistema
            </p>
          </div>

          <Message
            severity="info"
            text="Los siguientes datos solo pueden ser modificados por un administrador del sistema."
            style={{ width: '100%', marginBottom: '1.5rem' }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
            {/* Rol */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label>Rol</label>
              <div
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 'var(--field-height)',
                }}
              >
                <Badge value={roleBadge.label} severity={roleBadge.severity} />
              </div>
            </div>

            {/* Puntuación */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label>Puntuación</label>
              <InputText value={`${user.puntuacion || 0} puntos (Juegos)`} disabled />
            </div>

            {/* Sección */}
            <div className="field" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '250px' }}>
              <label>Sección</label>
              <div
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  opacity: 0.7,
                  minHeight: 'var(--field-height)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {user.seccion && Array.isArray(user.seccion) && user.seccion.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {user.seccion.map((sec: string, idx: number) => (
                      <Badge key={idx} value={sec} severity="info" />
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">No asignada</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria completa */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        {/* SECCIÓN 3: ZONA DE RIESGO */}
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                color: '#dc2626',
              }}
            >
              <i
                className="pi pi-exclamation-triangle"
                style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}
              ></i>
              Zona de Riesgo
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                marginLeft: '2.25rem',
                marginTop: '0',
              }}
            >
              Gestiona la seguridad de tu cuenta
            </p>
          </div>

          <Button
            label="Cambiar Contraseña"
            icon="pi pi-key"
            onClick={() => setShowPasswordDialog(true)}
            className="btn-primary"
          />
        </div>

        {/* Botones de Acción */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-primary)',
          }}
        >
          <Button
            label="Descartar cambios"
            icon="pi pi-times"
            onClick={handleCancel}
            className="p-button-outlined p-button-secondary"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={handleSave}
            loading={isSaving}
            className="p-button-primary"
          />
        </div>
      </Card>

      {/* DIÁLOGO DE CAMBIO DE CONTRASEÑA */}
      <Dialog
        header="Cambiar Contraseña"
        visible={showPasswordDialog}
        style={{ width: '500px' }}
        onHide={() => {
          setShowPasswordDialog(false);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        modal
        draggable={false}
        resizable={false}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div style={{ padding: '1rem 0' }}>
          <Message
            severity="warn"
            text="Después de cambiar tu contraseña, se cerrará tu sesión automáticamente."
            style={{ width: '100%', marginBottom: '1.5rem' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
            <div className="field">
              <label htmlFor="newPassword">Nueva Contraseña</label>
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
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
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
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '2rem',
            }}
          >
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
              }}
              className="p-button-outlined p-button-secondary"
            />
            <Button
              label="Cambiar Contraseña"
              icon="pi pi-check"
              onClick={handleChangePassword}
              loading={isChangingPassword}
              className="btn-primary"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
