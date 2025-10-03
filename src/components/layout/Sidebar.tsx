import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/', subtitle: 'Inicio' },
  { label: 'Grupos', icon: 'pi pi-users', route: '/grupos', subtitle: 'Gestión de usuarios y grupos' },
  { label: 'Actividades', icon: 'pi pi-calendar', route: '/actividades', subtitle: 'Eventos y talleres' },
  { label: 'Materiales', icon: 'pi pi-folder', route: '/materiales', subtitle: 'Recursos y documentos' },
  { label: 'Contacto', icon: 'pi pi-phone', route: '/contacto', subtitle: 'Información de contacto' },
  { label: 'Acerca de HERES', icon: 'pi pi-info-circle', route: '/about', subtitle: 'Conoce el proyecto',}
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-full ${
      collapsed ? 'w-18' : 'w-66'
    }`}>
      {/* Header */}
      <div className="h-20 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        {/* Logo - SIEMPRE visible y clickeable cuando está colapsado */}
        <div
          className={`flex items-center ${collapsed ? 'mx-auto cursor-pointer' : 'space-x-3'}`}
          onClick={collapsed ? onToggle : undefined}
          title={collapsed ? 'Expandir sidebar' : ''}
        >
          <div className="w-8 h-8 flex-shrink-0">
            <img
              src="/logos/favicon-96x96.png"
              alt="HERES Logo"
              className="w-full h-full object-contain rounded-md block dark:hidden shadow-sm"
            />
            <img
              src="/logos/favicon-96x96.png"
              alt="HERES Logo"
              className="w-full h-full object-contain rounded-md hidden dark:block filter brightness-110 shadow-sm"
            />
          </div>

          {/* Texto solo cuando está expandido */}
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">HERES</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Salesianos</p>
            </div>
          )}
        </div>

        {/* Botón de colapsar - solo visible cuando está expandido */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Contraer sidebar"
          >
            <i className="pi pi-angle-left text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Menu Items - crece para ocupar espacio disponible */}
      <nav className="flex-1 p-2 overflow-y-auto" role="navigation" aria-label="Menú principal">
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
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                  aria-label={`Ir a ${item.label}`}
                  title={collapsed ? `${item.label} - ${item.subtitle}` : ''}
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

      {/* Footer - SIEMPRE pegado abajo */}
      <div className={`border-t border-gray-200 dark:border-gray-700 flex-shrink-0 ${collapsed ? 'p-2' : 'p-4'}`}>
        {!collapsed ? (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p className="font-medium">HERES v1.0</p>
            <p>Salesianos © {new Date().getFullYear()}</p>
          </div>
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <i className="pi pi-info-circle text-sm" />
          </div>
        )}
      </div>
    </div>
  );
};
