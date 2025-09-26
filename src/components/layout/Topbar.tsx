import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

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
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const menuRef = useRef<Menu>(null);

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => {
        // Navigate to profile
      }
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => {
        // Navigate to settings
      }
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
      }
    }
  ];

  const getRoleBadge = (role: string) => {
    const badges = {
      director: { label: 'Director', severity: 'danger' as const },
      coordinador: { label: 'Coordinador', severity: 'warning' as const },
      animador: { label: 'Animador', severity: 'info' as const }
    };
    return badges[role as keyof typeof badges] || { label: role, severity: 'info' as const };
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
            <h1 className="text-xl font-bold text-gray-800">
              {getPageTitle(location.pathname)}
            </h1>
            <p className="text-sm text-gray-500">Centro Juvenil Salesianos</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar miembros, actividades..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
          <i className="pi pi-bell text-lg" />
          <Badge value="2" severity="danger" className="absolute -top-1 -right-1" />
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <div className="flex items-center justify-end space-x-2">
              <Badge 
                value={getRoleBadge(user?.role || '').label} 
                severity={getRoleBadge(user?.role || '').severity}
                className="text-xs"
              />
            </div>
          </div>
          
          <button
            onClick={(e) => menuRef.current?.toggle(e)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Avatar
              image={user?.avatar}
              label={user?.name?.charAt(0)}
              size="normal"
              shape="circle"
              className="bg-red-500 text-white"
            />
            <i className="pi pi-angle-down text-gray-600 hidden sm:block" />
          </button>
          
          <Menu
            ref={menuRef}
            model={userMenuItems}
            popup
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};