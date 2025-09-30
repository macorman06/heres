import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { User } from '../../services/api';

interface MemberCardProps {
  user: User;
  currentUser?: User;  // ✅ OPCIONAL: Usuario actual logueado
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  showEditButton: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({
                                                        user,
                                                        currentUser,
                                                        onView,
                                                        onEdit,
                                                        showEditButton
                                                      }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const generateImageFilename = (nombre: string, apellido1: string): string => {
    const cleanName = (name: string) =>
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();

    const cleanNombre = cleanName(nombre);
    const cleanApellido1 = cleanName(apellido1);
    return `${cleanNombre}_${cleanApellido1}`;
  };

  useEffect(() => {
    if (!user.nombre || !user.apellido1) {
      setImageLoaded(true);
      return;
    }

    const checkImageExists = async () => {
      const baseFilename = generateImageFilename(
        user.nombre ?? 'sin‐nombre',
        user.apellido1 ?? 'sin‐apellido'
      );
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
          setImageLoaded(true);
          return;
        } catch {
          // Continue to next extension
        }
      }

      setProfileImage(null);
      setImageLoaded(true);
    };

    checkImageExists();
  }, [user.nombre, user.apellido1]);

  // ✅ FUNCIÓN CORREGIDA: Con validaciones de seguridad
  const canEditUser = (): boolean => {
    // ✅ Validar que currentUser existe
    if (!currentUser || !currentUser.id || !currentUser.rol_id) {
      console.warn('currentUser no está disponible o es incompleto:', currentUser);
      return false;
    }

    // ✅ Validar que user tiene los campos necesarios
    if (!user || !user.rol_id) {
      console.warn('user no tiene rol_id:', user);
      return false;
    }

    // No puedes editarte a ti mismo (opcional)
    if (currentUser.id === user.id) {
      return false; // Cambia a true si quieres permitir auto-edición
    }

    // Jerarquía de roles (menor número = mayor jerarquía)
    const roleHierarchy: { [key: number]: number } = {
      1: 1, // superuser - puede editar todos
      2: 2, // director - puede editar coordinador, animador, miembro
      3: 3, // coordinador - puede editar animador, miembro
      4: 4, // animador - puede editar solo miembro
      5: 5  // miembro - no puede editar nadie
    };

    const currentUserLevel = roleHierarchy[currentUser.rol_id] || 5;
    const targetUserLevel = roleHierarchy[user.rol_id] || 5;

    // Solo puedes editar usuarios de nivel inferior (número mayor)
    return currentUserLevel < targetUserLevel;
  };

  const getRoleBadge = (roleId: number) => {
    const roleMap = {
      1: 'superuser',
      2: 'director',
      3: 'coordinador',
      4: 'animador',
      5: 'miembro'
    };

    const roleKey = roleMap[roleId as keyof typeof roleMap] || 'miembro';

    const badges = {
      superuser: { label: 'Superusuario', severity: 'danger' as const },
      director: { label: 'Director', severity: 'danger' as const },
      coordinador: { label: 'Coordinador', severity: 'warning' as const },
      animador: { label: 'Animador', severity: 'success' as const },
      miembro: { label: 'Miembro', severity: 'info' as const }
    };

    return badges[roleKey] || { label: 'Usuario', severity: 'info' as const };
  };

  const handleCardClick = () => {
    onView(user);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(user);
  };

  const userInitials = `${user.nombre?.charAt(0) || ''}${user.apellido1?.charAt(0) || ''}`.toUpperCase();
  const fullName = `${user.nombre || ''} ${user.apellido1 || ''}`.trim();
  const displayEmail = user.email || 'Sin email';
  const roleBadge = getRoleBadge(user.rol_id || 5);

  // ✅ LÓGICA MEJORADA: Solo mostrar botón si tiene permisos Y está habilitado globalmente
  const shouldShowEditButton = showEditButton && canEditUser();

  return (
    <Card
      className="member-card cursor-pointer hover:shadow-md transition-shadow duration-200 h-full rounded-lg"
      onClick={handleCardClick}
      style={{
        minHeight: 'auto',
        padding: '0',
        margin: '0',
        width: '100%',
        minWidth: '220px',
        maxWidth: '100%'
      }}
    >
      <div className="flex flex-col items-center p-3 space-y-2 relative">
        {/* ✅ BOTÓN CONDICIONAL: Solo aparece si tiene permisos */}
        {shouldShowEditButton && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text p-button-sm absolute top-1 right-1 z-10"
            style={{
              width: '28px',
              height: '28px',
              minWidth: '28px'
            }}
            onClick={handleEditClick}
            tooltip="Editar usuario"
            tooltipOptions={{ position: 'left' }}
          />
        )}

        {/* Avatar - más compacto */}
        <div className="flex-shrink-0">
          {imageLoaded && (
            <>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${user.nombre} ${user.apellido1}`}
                  className="rounded-full border-2 border-gray-200 object-cover"
                  style={{ width: '60px', height: '60px' }}
                  onError={() => {
                    console.log(`❌ Error cargando imagen: ${profileImage}`);
                    setProfileImage(null);
                  }}
                />
              ) : (
                <Avatar
                  label={userInitials}
                  size="large"
                  shape="circle"
                  className="bg-blue-500 text-white border-2 border-gray-200"
                  style={{ width: '60px', height: '60px' }}
                />
              )}
            </>
          )}
        </div>

        {/* Información del usuario - más compacta */}
        <div className="text-center flex-1 min-w-0 space-y-1">
          {/* Nombre */}
          <h3
            className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight truncate"
            title={fullName}
            style={{ margin: '0', padding: '0' }}
          >
            {fullName}
          </h3>

          {/* Email - más compacto */}
          {user.email && (
            <p
              className="text-xs text-gray-600 dark:text-gray-300 truncate"
              title={displayEmail}
              style={{ margin: '0', padding: '0' }}
            >
              {displayEmail}
            </p>
          )}

          {/* Badge de rol - más pequeño */}
          <Badge
            value={roleBadge.label}
            severity={roleBadge.severity}
            className="text-xs px-2 py-1"
            style={{
              fontSize: '0.65rem',
              fontWeight: 'normal'
            }}
          />
        </div>
      </div>
    </Card>
  );
};
