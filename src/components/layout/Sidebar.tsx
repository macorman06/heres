import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', subtitle: 'Inicio' },
  { label: 'Actividades', icon: 'pi pi-calendar', route: '/activities', subtitle: 'Eventos y talleres', badge: 3 },
  { label: 'Grupos', icon: 'pi pi-users', route: '/groups', subtitle: 'Gestión de grupos' },
  { label: 'Materiales', icon: 'pi pi-folder', route: '/materials', subtitle: 'Recursos y documentos' },
  { label: 'Miembros', icon: 'pi pi-user', route: '/members', subtitle: 'Animadores y coordinadores' },
  { label: 'Contacto', icon: 'pi pi-phone', route: '/contact', subtitle: 'Información de contacto' }
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className={`bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <img 
              src="/salesianos_sticker.png" 
              alt="Salesianos" 
              className="w-8 h-8"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">HERES</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Salesianos</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
        >
          <i className={`pi ${collapsed ? 'pi-angle-right' : 'pi-angle-left'} text-gray-600 dark:text-gray-300`} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.route;
            return (
              <li key={item.route}>
                <button
                  onClick={() => handleMenuClick(item.route)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-l-4 border-red-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <i className={`${item.icon} text-lg ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.subtitle}</p>
                      )}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>HERES v1.0</p>
            <p>Salesianos © 2024</p>
          </div>
        </div>
      )}
    </div>
  );
};