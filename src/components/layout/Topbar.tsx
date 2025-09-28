import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

// Usuario mockeado (usando datos de Marcos Corpas)
const mockUser = {
  id: '7',
  name: 'Marcos Corpas',
  email: 'marcos.corpas@salesianos.com',
  avatar: '/users/marcos_corpas.png',
  role: 'Animador',
  section: 'CJ',
  isAuthenticated: true
};

// Datos mockeados de notificaciones
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
    '/groups': 'Grupos',
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

  // Mock logout function
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    // Aquí podrías redirigir a la página de login o limpiar el estado
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
      director: { label: 'Director', severity: 'danger' as const },
      coordinador: { label: 'Coordinador', severity: 'warning' as const },
      animador: { label: 'Animador', severity: 'success' as const }, // ✅ Cambiado a 'success' (verde)
      miembro: { label: 'Miembro', severity: 'success' as const }
    };
    return badges[role.toLowerCase() as keyof typeof badges] || { label: role, severity: 'success' as const };
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

  return (
    <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 flex items-center justify-between transition-colors duration-200">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          {sidebarCollapsed && (
            <img
              src="/salesianos_sticker.png"
              alt="Salesianos"
              className="w-8 h-8"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {getPageTitle(location.pathname)}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Herramienta de Recursos Salesianos</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar miembros, actividades..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
          onClick={handleNotificationClick}
          title="Notificaciones"
        >
          <i className="pi pi-bell text-lg" />
          {mockNotifications.filter(n => !n.read).length > 0 && (
            <Badge
              value={mockNotifications.filter(n => !n.read).length.toString()}
              severity="danger"
              className="absolute -top-1 -right-1"
            />
          )}
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{mockUser.name}</p>
            <div className="flex items-center justify-end space-x-2">
              <Badge
                value={getRoleBadge(mockUser.role).label}
                severity={getRoleBadge(mockUser.role).severity}
                className="text-xs"
              />
            </div>
          </div>

          <button
            onClick={(e) => menuRef.current?.toggle(e)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
            title={`Menú de ${mockUser.name}`}
          >
            <Avatar
              image={mockUser.avatar}
              label={mockUser.name.charAt(0)}
              size="normal"
              shape="circle"
              className="bg-red-500 text-white border-2 border-white shadow-sm"
            />
            <i className="pi pi-angle-down text-gray-600 dark:text-gray-300 hidden sm:block" />
          </button>

          <Menu
            ref={menuRef}
            model={userMenuItems}
            popup
            className="mt-2 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};
