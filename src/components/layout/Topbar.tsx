import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useLocation, useNavigate } from 'react-router-dom';
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
    read: false,
  },
  {
    id: '2',
    title: 'Recordatorio: Reunión semanal',
    message: 'La reunión semanal es mañana a las 21:00',
    time: '1 hora',
    read: false,
  },
];

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/activities': 'Actividades',
    '/materials': 'Materiales',
    '/members': 'Miembros',
    '/contact': 'Contacto',
  };
  return routes[pathname] || 'HERES';
};

// eslint-disable-next-line no-empty-pattern
export const Topbar: React.FC<TopbarProps> = ({}) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const menuRef = useRef<Menu>(null);
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { user, logout } = useAuth();

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

  useEffect(() => {
    if (!user?.nombre || !user?.apellido1) {
      setImageLoaded(true);
      return;
    }

    const checkImageExists = async () => {
      const baseFilename = generateImageFilename(user.nombre, user.apellido1 ?? '');

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
  }, [user?.nombre, user?.apellido1]);

  const handleLogout = async () => {
    try {
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
        navigate('/profile');
      },
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => {},
    },
    {
      separator: true,
    },
    {
      label: 'Notificaciones',
      icon: 'pi pi-bell',
      badge: mockNotifications.filter((n) => !n.read).length.toString(),
      command: () => {
        // Open notifications panel
      },
    },
    {
      separator: true,
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        handleLogout();
      },
    },
  ];

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
        label: role || 'Usuario',
        severity: 'info' as const,
      }
    );
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      /* empty */
    }
  };

  const handleNotificationClick = () => {};

  const displayName = user?.nombre || 'Usuario';
  const fullName = `${user?.nombre || ''} ${user?.apellido1 || ''}`.trim() || 'Usuario';
  const displayRole = user?.rol || 'miembro';
  const userInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleBadge = getRoleBadge(displayRole);

  return (
    <header className="w-100% bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
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
            <InputText
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-search"
            />
          </div>
        </div>

        {/* Right section - User info */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Notifications */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <i className="pi pi-bell text-lg"></i>
            {mockNotifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {mockNotifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</div>
              <div className="text-xs">
                <Badge value={roleBadge.label} severity={roleBadge.severity} className="text-xs" />
              </div>
            </div>

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

          <Menu model={userMenuItems} popup ref={menuRef} />
        </div>
      </div>
    </header>
  );
};
