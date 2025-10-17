import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../common/UserAvatar';
import './Topbar.css';
interface TopbarProps {
  sidebarCollapsed: boolean;
}

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
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
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

  const displayName = user ? `${user.nombre} ${user.apellido1}` : 'Usuario';
  const displayRole = user?.rol || 'miembro';
  const roleBadge = getRoleBadge(displayRole);

  return (
    <div className="topbar">
      {/* Título de página */}
      <div className="topbar-left">
        <h2 className="page-title">{getPageTitle(location.pathname)}</h2>
      </div>

      {/* Área de usuario */}
      <div className="topbar-right">
        <ThemeToggle />

        <div className="user-section" onClick={(e) => menuRef.current?.toggle(e)}>
          <UserAvatar
            userId={user?.id || 0}
            nombre={user?.nombre || ''}
            apellido={user?.apellido1 || ''}
            size="medium"
          />

          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <Badge value={roleBadge.label} severity={roleBadge.severity} className="role-badge" />
          </div>

          <i className="pi pi-chevron-down" />
        </div>

        <Menu model={userMenuItems} popup ref={menuRef} />
      </div>
    </div>
  );
};
