// src/components/members/FloatingActionButton.tsx
import React from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '../../hooks/useAuth';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: string;
  tooltip?: string;
  visible?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
                                                                            onClick,
                                                                            icon = 'pi pi-plus',
                                                                            tooltip = 'Añadir nuevo usuario', // ✅ CAMBIAR A USUARIO
                                                                            visible = true
                                                                          }) => {
  const { hasPermission } = useAuth();

  // ✅ CAMBIAR PERMISOS A USUARIOS
  // Check if user can create users (coordinador level or higher = rol_id <= 3)
  if (!hasPermission(3) || !visible) {
    return null;
  }

  return (
    <Button
      icon={icon}
      rounded
      size="large"
      severity="info"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-shadow duration-200"
      tooltip={tooltip}
      tooltipOptions={{ position: 'left' }}
      aria-label={tooltip}
    />
  );
};
