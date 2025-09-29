import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '../../hooks/useAuth';

interface FloatingActionButtonProps {
  onAddUser: () => void;
  onAddMember: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddUser,
  onAddMember
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hasPermission } = useAuth();

  const canCreateUsers = hasPermission('create', 'users');
  const canCreateMembers = hasPermission('create', 'members');

  if (!canCreateUsers && !canCreateMembers) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddUser = () => {
    setIsExpanded(false);
    onAddUser();
  };

  const handleAddMember = () => {
    setIsExpanded(false);
    onAddMember();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Overlay to close FAB when clicking outside */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      <div className={`flex flex-col items-end space-y-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {canCreateUsers && (
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Añadir Usuario
              </span>
            </div>
            <Button
              icon="pi pi-user-plus"
              className="p-button-rounded bg-blue-600 border-blue-600 hover:bg-blue-700 shadow-lg"
              onClick={handleAddUser}
              tooltip="Crear nuevo usuario con acceso al sistema"
              tooltipOptions={{ position: 'left' }}
            />
          </div>
        )}

        {canCreateMembers && (
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Añadir Miembro
              </span>
            </div>
            <Button
              icon="pi pi-users"
              className="p-button-rounded bg-green-600 border-green-600 hover:bg-green-700 shadow-lg"
              onClick={handleAddMember}
              tooltip="Crear nuevo miembro sin acceso al sistema"
              tooltipOptions={{ position: 'left' }}
            />
          </div>
        )}
      </div>

      {/* Main FAB button */}
      <Button
        icon={isExpanded ? "pi pi-times" : "pi pi-plus"}
        className={`p-button-rounded shadow-lg transition-all duration-300 ${
          isExpanded 
            ? 'bg-gray-600 border-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-red-600 border-red-600 hover:bg-red-700'
        }`}
        onClick={toggleExpanded}
        style={{ width: '56px', height: '56px' }}
        tooltip={isExpanded ? "Cerrar menú" : "Añadir nuevo"}
        tooltipOptions={{ position: 'left' }}
      />
    </div>
  );
};