import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const toast = useRef<Toast>(null);

  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    fecha_nacimiento: '',
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Avatar
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido1: user.apellido1 || '',
        apellido2: user.apellido2 || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || '',
        codigo_postal: user.codigo_postal || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
      });
      checkProfileImage();
    }
  }, [user]);

  const cleanName = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

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
        // Continue
      }
    }
    setProfileImage(null);
  };

  // En ProfilePage.tsx - ACTUALIZAR esta función

  const handleImageUpload = (event: FileUploadHandlerEvent) => {
    const file = event.files[0];
    if (!file) return;

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

    // Validar tipo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten imágenes PNG, JPG o WEBP',
        life: 3000,
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      // Generar nombre del archivo
      const baseFilename = `${cleanName(user?.nombre || '')}_${cleanName(user?.apellido1 || '')}`;
      const filename = `${baseFilename}.png`;

      // Leer el archivo y convertirlo a Data URL
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;

          // Procesar imagen con canvas (redimensionar y convertir a PNG)
          const img = new Image();
          img.onload = () => {
            // Crear canvas para redimensionar
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('No se pudo crear canvas');
            }

            // Redimensionar manteniendo proporción (max 500x500)
            let width = img.width;
            let height = img.height;
            const maxSize = 500;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;

            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir a PNG blob
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  throw new Error('Error al convertir imagen');
                }

                // Crear URL local para previsualización
                const imageUrl = URL.createObjectURL(blob);

                // Actualizar estado con la nueva imagen
                setProfileImage(`/users/${filename}?t=${Date.now()}`);

                // ⚠️ IMPORTANTE: Aquí guardarías en localStorage o IndexedDB
                // Por ahora, solo mostramos la previsualización
                saveImageLocally(filename, blob);

                toast.current?.show({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: '✅ Imagen de perfil actualizada',
                  life: 3000,
                });

                // Disparar evento para actualizar otros componentes
                window.dispatchEvent(
                  new CustomEvent('profileImageUpdated', {
                    detail: { filename, url: imageUrl },
                  })
                );
              },
              'image/png',
              0.95
            );
          };

          img.onerror = () => {
            throw new Error('Error al cargar la imagen');
          };

          img.src = dataUrl;
        } catch (error) {
          console.error('❌ Error procesando imagen:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error instanceof Error ? error.message : 'Error procesando imagen',
            life: 5000,
          });
        } finally {
          setIsUploadingImage(false);
        }
      };

      reader.onerror = () => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error leyendo el archivo',
          life: 3000,
        });
        setIsUploadingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error instanceof Error ? error.message : 'Error desconocido',
        life: 5000,
      });
      setIsUploadingImage(false);
    }
  };

  // ✅ Función para guardar imagen localmente (IndexedDB o localStorage)
  const saveImageLocally = async (filename: string, blob: Blob) => {
    try {
      // Opción 1: IndexedDB (recomendado para imágenes)
      const db = await openImageDB();
      await saveImageToDB(db, filename, blob);
    } catch (error) {
      console.error('❌ Error guardando imagen:', error);
    }
  };

  // Helper functions para IndexedDB
  const openImageDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('HeresProfileImages', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'filename' });
        }
      };
    });
  };

  const saveImageToDB = (db: IDBDatabase, filename: string, blob: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.put({ filename, blob, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user) {
        updateUser({ ...user, ...formData });
      }

      setSuccessMessage('✅ Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('❌ Error al actualizar el perfil');
      console.error('Error guardando perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage('✅ Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (error) {
      setErrorMessage('❌ Error al cambiar la contraseña');
      console.error('Error cambiando contraseña:', error);
    } finally {
      setIsSaving(false);
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

  const userInitials = user.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleBadge = getRoleBadge(user.rol || 'miembro');

  return (
    <div className="profile-page">
      <Toast ref={toast} />

      <div className="profile-container">
        {/* Mensajes */}
        {successMessage && (
          <Message severity="success" text={successMessage} className="w-full mb-3" />
        )}
        {errorMessage && <Message severity="error" text={errorMessage} className="w-full mb-3" />}

        {/* Card principal con información del usuario */}
        <Card className="profile-header-card">
          <div className="profile-header">
            <div className="profile-avatar-section">
              {profileImage ? (
                <Avatar
                  image={profileImage}
                  size="xlarge"
                  shape="circle"
                  className="profile-avatar-large"
                />
              ) : (
                <Avatar
                  label={userInitials}
                  size="xlarge"
                  shape="circle"
                  className="profile-avatar-large"
                  style={{ backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '3rem' }}
                />
              )}

              {/* ✅ NUEVO: FileUpload para cambiar foto */}
              <div className="upload-overlay">
                <FileUpload
                  mode="basic"
                  name="profileImage"
                  accept="image/*"
                  maxFileSize={5000000}
                  customUpload
                  uploadHandler={handleImageUpload}
                  auto
                  chooseLabel={isUploadingImage ? 'Subiendo...' : 'Cambiar foto'}
                  className="profile-upload-btn"
                  disabled={isUploadingImage}
                />
              </div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">
                {user.nombre} {user.apellido1} {user.apellido2}
              </h2>
              <p className="profile-email">{user.email}</p>
              <Badge value={roleBadge.label} severity={roleBadge.severity} className="mt-2" />
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <Button
                  label="Editar Perfil"
                  icon="pi pi-user-edit"
                  onClick={() => setIsEditing(true)}
                />
              ) : (
                <>
                  <Button
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={handleSave}
                    loading={isSaving}
                  />
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        nombre: user.nombre || '',
                        apellido1: user.apellido1 || '',
                        apellido2: user.apellido2 || '',
                        email: user.email || '',
                        telefono: user.telefono || '',
                        direccion: user.direccion || '',
                        ciudad: user.ciudad || '',
                        codigo_postal: user.codigo_postal || '',
                        fecha_nacimiento: user.fecha_nacimiento || '',
                      });
                    }}
                    className="p-button-outlined p-button-secondary"
                  />
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Resto del formulario (igual que antes) */}
        <Card title="Información Personal" className="mt-3">
          <div className="profile-form">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="nombre">Nombre *</label>
                <InputText
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="apellido1">Primer Apellido *</label>
                <InputText
                  id="apellido1"
                  value={formData.apellido1}
                  onChange={(e) => handleInputChange('apellido1', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="apellido2">Segundo Apellido</label>
                <InputText
                  id="apellido2"
                  value={formData.apellido2}
                  onChange={(e) => handleInputChange('apellido2', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email *</label>
                <InputText
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="telefono">Teléfono</label>
                <InputText
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                <InputText
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field field-full">
                <label htmlFor="direccion">Dirección</label>
                <InputText
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="ciudad">Ciudad</label>
                <InputText
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="codigo_postal">Código Postal</label>
                <InputText
                  id="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Divider />

          <div className="role-info">
            <p>
              <strong>Rol:</strong> <Badge value={roleBadge.label} severity={roleBadge.severity} />
            </p>
            <p className="text-muted">
              El rol solo puede ser modificado por un administrador del sistema.
            </p>
          </div>
        </Card>

        {/* Sección de cambio de contraseña */}
        <Card title="Seguridad" className="mt-3">
          <div className="password-section">
            {!showPasswordSection ? (
              <Button
                label="Cambiar Contraseña"
                icon="pi pi-lock"
                onClick={() => setShowPasswordSection(true)}
              />
            ) : (
              <div className="form-grid">
                <div className="field field-full">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <Password
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    feedback={false}
                    toggleMask
                    className="w-full"
                  />
                </div>

                <div className="field">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <Password
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    toggleMask
                    className="w-full"
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
                  />
                </div>

                <div className="field field-full flex gap-2">
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                  />
                  <Button
                    label="Guardar Contraseña"
                    icon="pi pi-check"
                    onClick={handleChangePassword}
                    loading={isSaving}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
