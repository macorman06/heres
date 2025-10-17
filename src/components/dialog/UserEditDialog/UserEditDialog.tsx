// src/components/dialog/UserEditDialog/UserEditDialog.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { getInitials } from '../../../utils/avatarUtils';
import type { User, UserFormData, Grupo } from '../../../types/user.types';
import './UserEditDialog.css';

interface UserEditDialogProps {
  visible: boolean;
  user: User;
  grupos: Grupo[];
  onHide: () => void;
  onSave: (userData: Partial<UserFormData>) => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  visible,
  user,
  grupos,
  onHide,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<UserFormData>>({});
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (user && visible) {
      const grupoId = user.grupos && user.grupos.length > 0 ? user.grupos[0] : null;

      setFormData({
        nombre: user.nombre,
        apellido1: user.apellido1,
        apellido2: user.apellido2,
        email: user.email,
        rol_id: user.rol_id,
        grupo_id: grupoId,
        centro_juvenil: user.centro_juvenil,
        seccion: user.seccion || [],
        birthday: user.birthday,
        edad: user.edad,
        sexo: user.sexo,
        telefono: user.telefono,
        direccion: user.direccion,
        localidad: user.localidad,
        talla: user.talla,
        alergias: user.alergias || [],
      });

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      setAvatarLoaded(false);
      setAvatarUrl(`${API_BASE_URL}/usuarios/${user.id}/avatar`);
    }
  }, [user, visible]);

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten archivos de imagen',
        life: 3000,
      });
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'La imagen no puede superar los 5MB',
        life: 3000,
      });
      return;
    }

    try {
      setUploadingAvatar(true);

      // Actualizar la URL del avatar con timestamp para forzar recarga
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      setAvatarLoaded(false);
      setAvatarUrl(`${API_BASE_URL}/usuarios/${user.id}/avatar?t=${Date.now()}`);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Foto de perfil actualizada correctamente',
        life: 3000,
      });
    } catch (error) {
      console.error('Error subiendo avatar:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar la foto de perfil',
        life: 3000,
      });
    } finally {
      setUploadingAvatar(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getUserInitials = () => {
    const nombre = formData.nombre || user.nombre || '';
    const apellido = formData.apellido1 || user.apellido1 || '';
    return getInitials(nombre, apellido);
  };

  const getFullName = () => {
    const nombre = formData.nombre || user.nombre || '';
    const apellido1 = formData.apellido1 || user.apellido1 || '';
    const apellido2 = formData.apellido2 || user.apellido2 || '';
    return `${nombre} ${apellido1} ${apellido2}`.trim();
  };

  // Opciones
  const rolOptions = [
    { label: 'Superusuario', value: 1 },
    { label: 'Director', value: 2 },
    { label: 'Coordinador', value: 3 },
    { label: 'Animador', value: 4 },
    { label: 'Miembro', value: 5 },
  ];

  const centroOptions = [
    { label: 'CJ Juveliber', value: 'CJ Juveliber' },
    { label: 'CJ La Balsa', value: 'CJ La Balsa' },
    { label: 'CJ Sotojoven', value: 'CJ Sotojoven' },
  ];

  const seccionOptions = [
    { label: 'J1', value: 'J1' },
    { label: 'J2', value: 'J2' },
    { label: 'J3', value: 'J3' },
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'PREAS', value: 'PREAS' },
  ];

  const sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'Otro' },
  ];

  const grupoOptions = [
    { label: 'Sin grupo', value: null },
    ...grupos.map((g) => ({ label: g.label, value: g.id })),
  ];

  // Header personalizado
  const dialogHeader = (
    <div className="dialog-header-content">
      <i className="pi pi-user-edit"></i>
      Editar Usuario
    </div>
  );

  // Footer personalizado
  const dialogFooter = (
    <div className="dialog-footer-actions">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        outlined
        className="btn-secondary"
      />
      <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} className="btn-primary" />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header={dialogHeader}
        footer={dialogFooter}
        className="user-edit-dialog"
        modal
        dismissableMask
        maskClassName="dialog-dark-mask"
        style={{ width: '50vw' }}
        breakpoints={{ '1400px': '60vw', '960px': '75vw', '640px': '95vw' }}
      >
        <div>
          {/* Sección: Avatar y Datos Básicos */}
          <div className="user-profile-header">
            <div className="avatar-section">
              <div
                className={`avatar-upload-container ${uploadingAvatar ? 'uploading' : ''}`}
                onClick={handleAvatarClick}
              >
                {!avatarLoaded && <div className="avatar-fallback">{getUserInitials()}</div>}
                <img
                  src={avatarUrl}
                  alt={getFullName()}
                  className="user-avatar-large"
                  style={{ display: avatarLoaded ? 'block' : 'none' }}
                  onError={() => setAvatarLoaded(false)}
                  onLoad={() => setAvatarLoaded(true)}
                />
                <div className="avatar-overlay">
                  <i className="pi pi-camera"></i>
                  <span>Subir Foto</span>
                </div>
                {uploadingAvatar && (
                  <div className="avatar-loading">
                    <i className="pi pi-spin pi-spinner"></i>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <div className="user-info-section">
              <h2 className="user-full-name">{getFullName()}</h2>
              {formData.email ? (
                <div className="user-email">
                  <i className="pi pi-envelope"></i>
                  {formData.email}
                </div>
              ) : (
                <div className="user-no-email">
                  <i className="pi pi-info-circle"></i>
                  Este usuario no tiene correo asignado
                </div>
              )}
            </div>
          </div>

          {/* Sección: Información Personal */}
          <div className="form-section">
            <h3 className="section-title">
              <i className="pi pi-user mr-2"></i>
              Información Personal
            </h3>

            <div className="form-row">
              {/* Nombre */}
              <div className="form-field">
                <label htmlFor="nombre">
                  Nombre <span className="required">*</span>
                </label>
                <InputText
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Nombre"
                />
              </div>

              {/* Primer Apellido */}
              <div className="form-field">
                <label htmlFor="apellido1">
                  Primer Apellido <span className="required">*</span>
                </label>
                <InputText
                  id="apellido1"
                  value={formData.apellido1 || ''}
                  onChange={(e) => handleChange('apellido1', e.target.value)}
                  placeholder="Primer apellido"
                />
              </div>

              {/* Segundo Apellido */}
              <div className="form-field">
                <label htmlFor="apellido2">Segundo Apellido</label>
                <InputText
                  id="apellido2"
                  value={formData.apellido2 || ''}
                  onChange={(e) => handleChange('apellido2', e.target.value)}
                  placeholder="Segundo apellido"
                />
              </div>
            </div>

            <div className="form-row">
              {/* Email */}
              <div className="form-field-full">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <InputText
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="form-row">
              {/* Sexo */}
              <div className="form-field">
                <label htmlFor="sexo">Sexo</label>
                <Dropdown
                  id="sexo"
                  value={formData.sexo}
                  options={sexoOptions}
                  onChange={(e) => handleChange('sexo', e.value)}
                  placeholder="Selecciona sexo"
                  showClear
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div className="form-field">
                <label htmlFor="birthday">Fecha de Nacimiento</label>
                <Calendar
                  id="birthday"
                  value={formData.birthday ? new Date(formData.birthday) : null}
                  onChange={(e) => handleChange('birthday', e.value?.toISOString().split('T')[0])}
                  dateFormat="dd/mm/yy"
                  showIcon
                />
              </div>

              {/* Teléfono */}
              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <InputText
                  id="telefono"
                  value={formData.telefono || ''}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="Teléfono"
                />
              </div>
            </div>
          </div>

          {/* Sección: Organización */}
          <div className="form-section">
            <h3 className="section-title">
              <i className="pi pi-building mr-2"></i>
              Organización
            </h3>

            <div className="form-row">
              {/* Rol */}
              <div className="form-field">
                <label htmlFor="rol">
                  Rol <span className="required">*</span>
                </label>
                <Dropdown
                  id="rol"
                  value={formData.rol_id}
                  options={rolOptions}
                  onChange={(e) => handleChange('rol_id', e.value)}
                  placeholder="Selecciona un rol"
                />
              </div>

              {/* Centro Juvenil */}
              <div className="form-field">
                <label htmlFor="centro">
                  Centro Juvenil <span className="required">*</span>
                </label>
                <Dropdown
                  id="centro"
                  value={formData.centro_juvenil}
                  options={centroOptions}
                  onChange={(e) => handleChange('centro_juvenil', e.value)}
                  placeholder="Selecciona centro"
                />
              </div>
            </div>

            <div className="form-row">
              {/* Grupo */}
              <div className="form-field">
                <label htmlFor="grupo">Grupo</label>
                <Dropdown
                  id="grupo"
                  value={formData.grupo_id}
                  options={grupoOptions}
                  onChange={(e) => handleChange('grupo_id', e.value)}
                  placeholder="Selecciona un grupo"
                  showClear
                  filter
                />
                <small className="form-help-text">
                  Grupo principal al que pertenece el usuario
                </small>
              </div>

              {/* Secciones */}
              <div className="form-field">
                <label htmlFor="secciones">Secciones</label>
                <MultiSelect
                  id="secciones"
                  value={formData.seccion}
                  options={seccionOptions}
                  onChange={(e) => handleChange('seccion', e.value)}
                  placeholder="Selecciona secciones"
                  display="chip"
                />
              </div>
            </div>
          </div>

          {/* Sección: Información Adicional */}
          <div className="form-section">
            <h3 className="section-title">
              <i className="pi pi-info-circle mr-2"></i>
              Información Adicional
            </h3>

            <div className="form-row">
              {/* Dirección */}
              <div className="form-field">
                <label htmlFor="direccion">Dirección</label>
                <InputText
                  id="direccion"
                  value={formData.direccion || ''}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  placeholder="Dirección"
                />
              </div>

              {/* Localidad */}
              <div className="form-field">
                <label htmlFor="localidad">Localidad</label>
                <InputText
                  id="localidad"
                  value={formData.localidad || ''}
                  onChange={(e) => handleChange('localidad', e.target.value)}
                  placeholder="Localidad"
                />
              </div>

              {/* Talla */}
              <div className="form-field">
                <label htmlFor="talla">Talla de Camiseta</label>
                <InputText
                  id="talla"
                  value={formData.talla || ''}
                  onChange={(e) => handleChange('talla', e.target.value)}
                  placeholder="Ej: M, L, XL"
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
