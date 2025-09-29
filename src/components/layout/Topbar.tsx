import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

// Datos mockeados de notificaciones (se mantienen por ahora)
const mockNotifications = [
  {
    id: '1',
    title: 'Nueva actividad programada',
    message: 'Se ha programado una nueva actividad para el sábado',
    time: '2 min',
    read: false
  },
  {
    id: '2',
    title: 'Recordatorio: Reunión semanal',
    message: 'La reunión semanal es mañana a las 21:00',
    time: '1 hora',
    read: false
  }
];

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/activities': 'Actividades',
    '/materials': 'Materiales',
    '/members': 'Miembros',
    '/contact': 'Contacto'
  };
  return routes[pathname] || 'HERES';
};

export const Topbar: React.FC<TopbarProps> = ({ sidebarCollapsed }) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const menuRef = useRef<Menu>(null);

  // ✅ NEW: Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Usar autenticación real en lugar de mock
  const { user, logout } = useAuth();

  // ✅ NEW: Generate profile image filename - Solo nombre + primer apellido
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

  // ✅ NEW: Check if profile image exists
  useEffect(() => {
    if (!user?.nombre || !user?.apellido1) {
      setImageLoaded(true);
      return;
    }

    const checkImageExists = async () => {
      const baseFilename = generateImageFilename(user.nombre, user.apellido1);
      console.log(`🔍 [Topbar] Buscando imagen para: ${baseFilename}`); // Debug

      const extensions = ['png', 'jpg', 'jpeg', 'webp'];

      for (const ext of extensions) {
        const imagePath = `/users/${baseFilename}.${ext}`;
        console.log(`🔍 [Topbar] Verificando: ${imagePath}`); // Debug

        try {
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              console.log(`✅ [Topbar] Imagen encontrada: ${imagePath}`); // Debug
              resolve();
            };
            img.onerror = () => {
              console.log(`❌ [Topbar] Imagen no encontrada: ${imagePath}`); // Debug
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
      console.log(`❌ [Topbar] Ninguna imagen encontrada para: ${baseFilename}`); // Debug
      setProfileImage(null);
      setImageLoaded(true);
    };

    checkImageExists();
  }, [user?.nombre, user?.apellido1]);

  // ✅ Función real de logout
  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando cierre de sesión...');
      logout(); // Esto limpia el token, usuario y redirige a /login
    } catch (error) {
      console.error('❌ Error durante logout:', error);
    }
  };

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => {
        console.log('Navegar a perfil');
        // Navigate to profile
      }
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => {
        console.log('Navegar a configuración');
        // Navigate to settings
      }
    },
    {
      separator: true
    },
    {
      label: 'Notificaciones',
      icon: 'pi pi-bell',
      badge: mockNotifications.filter(n => !n.read).length.toString(),
      command: () => {
        console.log('Ver todas las notificaciones');
        // Open notifications panel
      }
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        handleLogout();
      }
    }
  ];

  const getRoleBadge = (role: string) => {
    const badges = {
      superuser: { label: 'Superusuario', severity: 'danger' as const },
      director: { label: 'Director', severity: 'danger' as const },
      coordinador: { label: 'Coordinador', severity: 'warning' as const },
      animador: { label: 'Animador', severity: 'success' as const },
      miembro: { label: 'Miembro', severity: 'info' as const }
    };
    return badges[role?.toLowerCase() as keyof typeof badges] || { label: role || 'Usuario', severity: 'info' as const };
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      console.log('Buscando:', value);
      // Aquí implementarías la lógica de búsqueda
    }
  };

  const handleNotificationClick = () => {
    console.log('Mostrar notificaciones:', mockNotifications);
    // Aquí podrías abrir un panel de notificaciones o modal
  };

  // ✅ Mostrar información real del usuario
  const displayName = user?.nombre || 'Usuario';
  const fullName = `${user?.nombre || ''} ${user?.apellido1 || ''}`.trim() || 'Usuario';
  const displayRole = user?.rol || 'miembro';
  const userInitials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleBadge = getRoleBadge(displayRole);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Left section - Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {getPageTitle(location.pathname)}
          </h1>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
            <InputText
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Right section - User info */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <i className="pi pi-bell text-lg"></i>
            {mockNotifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {mockNotifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {fullName}
              </div>
              <div className="text-xs">
                <Badge
                  value={roleBadge.label}
                  severity={roleBadge.severity}
                  className="text-xs"
                />
              </div>
            </div>

            {/* ✅ UPDATED: User Avatar with profile image */}
            <button
              onClick={(e) => menuRef.current?.toggle(e)}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
            >
              {imageLoaded && (
                <>
                  {profileImage ? (
                    <div className="w-10 h-10 relative">
                      <img
                        src={profileImage}
                        alt={`${fullName} - Foto de perfil`}
                        className="w-full h-full object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
                        onError={() => {
                          console.log(`❌ [Topbar] Error cargando imagen: ${profileImage}`);
                          setProfileImage(null);
                        }}
                      />
                    </div>
                  ) : (
                    <Avatar
                      label={userInitials}
                      shape="circle"
                      className="bg-gradient-to-br from-red-500 to-red-600 text-white font-medium border-2 border-gray-300 dark:border-gray-600"
                    />
                  )}
                </>
              )}
              <i className="pi pi-chevron-down text-xs text-gray-500 dark:text-gray-400 ml-1"></i>
            </button>
          </div>

          {/* User Menu Overlay */}
          <Menu
            model={userMenuItems}
            popup
            ref={menuRef}
            className="mt-2"
          />
        </div>
      </div>
    </header>
  );
};
