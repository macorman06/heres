// src/pages/Members.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/api/index';
import type { User } from '../types/user.types';
import { UserEditDialog } from '../components/dialog/UserEditDialog/UserEditDialog.tsx';
import { MembersTable } from '../components/tables/MembersTable/MembersTable';
import { FilterHeader, FilterField } from '../components/common/FilterHeader/FilterHeader';
import '../styles/4-pages/members.css';

export const Members: React.FC = () => {
  const { user: currentUser } = useAuth();
  const toast = useRef<Toast>(null);

  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtros - Roles como array, Centro y Sección como valores únicos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCentro, setSelectedCentro] = useState<string | null>(null); // Volver a string | null
  const [selectedSeccion, setSelectedSeccion] = useState<string | null>(null); // Volver a string | null

  const isSuperUser = currentUser?.rol_id === 1;
  const userCentro = currentUser?.centro_juvenil || '';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      const filteredData = isSuperUser ? data : data.filter((u) => u.centro_juvenil === userCentro);
      setUsers(filteredData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar usuarios',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const canEditUser = (targetUser: User): boolean => {
    if (!currentUser) return false;
    return currentUser.rol_id < targetUser.rol_id;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRoles([]);
    setSelectedCentro(null);
    setSelectedSeccion(null);
  };

  // Configuración de filtros - Roles MultiSelect, Centro y Sección Dropdown
  const filterFields: FilterField[] = [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por nombre o email...',
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      id: 'roles',
      type: 'multiselect',
      placeholder: 'Roles',
      value: selectedRoles,
      options: [
        { label: 'Superusuario', value: 'superuser' },
        { label: 'Director', value: 'director' },
        { label: 'Coordinador', value: 'coordinador' },
        { label: 'Animador', value: 'animador' },
        { label: 'Miembro', value: 'miembro' },
      ],
      onChange: setSelectedRoles,
      showClear: true,
      maxSelectedLabels: 2,
      selectedItemsLabel: '{0} roles',
      display: 'chip',
    },
    {
      id: 'centro',
      type: 'dropdown',
      placeholder: 'Centro',
      value: selectedCentro,
      options: [
        { label: 'Todos', value: null },
        { label: 'CJ Juveliber', value: 'CJ Juveliber' },
        { label: 'CJ La Balsa', value: 'CJ La Balsa' },
        { label: 'CJ Sotojoven', value: 'CJ Sotojoven' },
      ],
      onChange: setSelectedCentro,
      showClear: true,
    },
    {
      id: 'seccion',
      type: 'dropdown',
      placeholder: 'Sección',
      value: selectedSeccion,
      options: [
        { label: 'Todas', value: null },
        { label: 'Chiqui', value: 'Chiqui' },
        { label: 'CJ', value: 'CJ' },
      ],
      onChange: setSelectedSeccion,
      showClear: true,
    },
  ];

  // Filtrar usuarios
  const filteredUsers = users.filter((u) => {
    // Búsqueda por texto
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        u.nombre?.toLowerCase().includes(search) ||
        u.apellido1?.toLowerCase().includes(search) ||
        u.apellido2?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    // Filtro por roles (múltiples)
    if (selectedRoles.length > 0 && !selectedRoles.includes(u.rol)) {
      return false;
    }

    // Filtro por centro (único) - null = Todos
    if (selectedCentro && u.centro_juvenil !== selectedCentro) {
      return false;
    }

    // Filtro por sección (único) - null = Todas
    if (selectedSeccion) {
      const hasSeccion = u.seccion?.some((s) => s === selectedSeccion);
      if (!hasSeccion) return false;
    }

    return true;
  });

  return (
    <div className="members-page">
      <Toast ref={toast} />

      {/* Header */}
      <div className="page-header">
        <div className="header-text">
          <h1>👥 Gestión de Usuarios</h1>
          <p className="header-subtitle">Administra y visualiza todos los usuarios del sistema.</p>
        </div>
      </div>

      {/* Mensaje para no super usuarios */}
      {!isSuperUser && (
        <Message
          severity="info"
          text={`Mostrando solo usuarios de ${userCentro}`}
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      {/* FilterHeader */}
      <FilterHeader
        fields={filterFields}
        onClearAll={clearFilters}
        resultsCount={filteredUsers.length}
        resultsLabel={filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
      />

      {/* Tabla de usuarios */}
      <MembersTable
        users={filteredUsers}
        onEditUser={handleUserClick}
        canEditUser={canEditUser}
        loading={loading}
      />

      {/* Dialog de edición */}
      <UserEditDialog
        user={selectedUser}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSave={fetchUsers}
        maskClassName="dialog-dark-mask"
      />
    </div>
  );
};
