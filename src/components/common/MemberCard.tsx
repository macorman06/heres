import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { User } from '../../services/api';

interface MemberCardProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  showEditButton: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({ user, onView, onEdit, showEditButton }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Generate profile image filename
  const generateImageFilename = (nombre: string, apellido1: string): string => {
    const cleanName = (name: string) =>
      name
        .toLowerCase()
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
        .replace(/[^a-z0-9]/g, '') // Solo letras y números
        .trim();

    const cleanNombre = cleanName(nombre);
    const cleanApellido1 = cleanName(apellido1);

    return `${cleanNombre}_${cleanApellido1}`;
  };

// ✅ Check if profile image exists - Solo usar nombre y apellido1
  useEffect(() => {
    if (!user.nombre || !user.apellido1) {
      setImageLoaded(true);
      return;
    }

    const checkImageExists = async () => {
      const baseFilename = generateImageFilename(user.nombre, user.apellido1); // ✅ FIXED: Sin apellido2
      console.log(`🔍 Buscando imagen para: ${baseFilename}`); // Debug

      const extensions = ['png', 'jpg', 'jpeg', 'webp'];

      for (const ext of extensions) {
        const imagePath = `/users/${baseFilename}.${ext}`;
        console.log(`🔍 Verificando: ${imagePath}`); // Debug

        try {
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              console.log(`✅ Imagen encontrada: ${imagePath}`); // Debug
              resolve();
            };
            img.onerror = () => {
              console.log(`❌ Imagen no encontrada: ${imagePath}`); // Debug
              reject();
            };
            img.src = imagePath;
          });

          // Si llegamos aquí, la imagen existe
          setProfileImage(imagePath);
          setImageLoaded(true);
          return;
        } catch {
          // Continue to next extension
        }
      }

      // No se encontró ninguna imagen
      console.log(`❌ Ninguna imagen encontrada para: ${baseFilename}`); // Debug
      setProfileImage(null);
      setImageLoaded(true);
    };

    checkImageExists();
  }, [user.nombre, user.apellido1]); // ✅ FIXED: Solo dependencias nombre y apellido1


  // ✅ Use the same badge system as Topbar
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

  // ✅ Section color helper
  const getSectionColor = (section?: string): string => {
    if (!section) return 'bg-gray-400';

    const sectionLower = section.toLowerCase();
    switch (sectionLower) {
      case 'chiqui':
        return 'bg-pink-500';
      case 'centro juvenil':
        return 'bg-blue-500';
      case 'infantil':
        return 'bg-green-500';
      case 'juvenil':
        return 'bg-purple-500';
      case 'catequesis':
        return 'bg-yellow-500';
      case 'deporte':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCardClick = () => {
    onView(user);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(user);
  };

  const userInitials = `${user.nombre.charAt(0)}${user.apellido1?.charAt(0) || ''}`.toUpperCase();
  const fullName = `${user.nombre} ${user.apellido1 || ''}`.trim();
  const displayEmail = user.email || 'Sin email';

  // ✅ Get role badge info
  const roleBadge = getRoleBadge(user.rol_id || 5);

  return (
    <Card
      className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Edit Button - Top Right */}
        {showEditButton && (
          <div className="absolute top-0 right-0 z-10">
            <Button
              icon="pi pi-pencil"
              rounded
              outlined
              size="small"
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={handleEditClick}
              tooltip="Editar usuario"
              tooltipOptions={{ position: 'left' }}
            />
          </div>
        )}

        {/* Header with Avatar, Name and Contact */}
        <div className="text-center">
          {/* ✅ Profile Image or Avatar with initials */}
          {imageLoaded && (
            <>
              {profileImage ? (
                <div className="mb-3 mx-auto w-24 h-24 relative">
                  <img
                    src={profileImage}
                    alt={`${fullName} - Foto de perfil`}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                    onError={() => {
                      console.log(`❌ Error cargando imagen: ${profileImage}`); // Debug
                      setProfileImage(null);
                    }}
                  />
                </div>
              ) : (
                <Avatar
                  label={userInitials}
                  size="xlarge"
                  shape="circle"
                  className="mb-3 mx-auto bg-gradient-to-br from-red-500 to-red-600 text-white font-bold shadow-md"
                />
              )}
            </>
          )}

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
            {fullName}
          </h3>

          {user.email && (
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <i className="pi pi-envelope text-xs"></i>
              <span className="truncate max-w-full">{displayEmail}</span>
            </div>
          )}
        </div>

        {/* ✅ Role Badge using consistent system */}
        <div className="flex justify-center mb-4">
          <Badge
            value={roleBadge.label}
            severity={roleBadge.severity}
            className="px-3 py-1 text-sm font-medium"
          />
        </div>

        {/* Allergies if present */}
        {user.alergias && user.alergias.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div className="flex items-center gap-1 mb-2">
              <i className="pi pi-exclamation-triangle text-orange-500 text-sm"></i>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Alergias:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.alergias.slice(0, 3).map((alergia, index) => (
                <Chip
                  key={index}
                  label={alergia}
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 text-xs"
                />
              ))}
              {user.alergias.length > 3 && (
                <Chip
                  label={`+${user.alergias.length - 3} más`}
                  className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
