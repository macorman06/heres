// src/pages/Members.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useAuth } from '../hooks/useAuth';
import { userService, groupService } from '../services/api/index';
import type { User } from '../types/user.types';
import type { Grupo } from '../types/group.types';
import { UserEditDialog } from '../components/dialog/UserEditDialog/UserEditDialog.tsx';
import { MembersTable } from '../components/tables/MembersTable/MembersTable';
import { FilterHeader, FilterField } from '../components/common/FilterHeader/FilterHeader';
import '../styles/4-pages/members.css';

export const Members: React.FC = () => {
  const { user: currentUser } = useAuth();
  const toast = useRef<Toast>(null);

  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtros
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCentro, setSelectedCentro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar usuarios Y grupos al montar
  useEffect(() => {
    fetchUsers();
    fetchGrupos();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los usuarios',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGrupos = async () => {
    try {
      const data = await groupService.getGroupsByCentro();
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los grupos',
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario actualizado correctamente',
        });
        fetchUsers();
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al actualizar usuario',
      });
    } finally {
      setDialogVisible(false);
      setSelectedUser(null);
    }
  };

  const canEditUser = (targetUser: User): boolean => {
    if (!currentUser) return false;

    // Superuser puede editar a todos
    if (currentUser.rol_id === 1) return true;

    // Director puede editar a coordinadores, animadores y miembros
    if (currentUser.rol_id === 2 && targetUser.rol_id >= 3) return true;

    // Coordinador puede editar animadores y miembros de su centro
    if (
      currentUser.rol_id === 3 &&
      targetUser.rol_id >= 4 &&
      targetUser.centro_juvenil === currentUser.centro_juvenil
    ) {
      return true;
    }

    // Nadie puede editar a un usuario de rol superior
    return false;
  };

  // ✅ Filtros aplicados con validación de null/undefined
  const filteredUsers = users.filter((user) => {
    const matchesRoles = selectedRoles.length === 0 || selectedRoles.includes(user.rol);
    const matchesCentro = !selectedCentro || user.centro_juvenil === selectedCentro;

    // ✅ CORRECCIÓN: Validar que los campos existan antes de usar toLowerCase()
    const matchesSearch =
      !searchTerm ||
      (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.apellido1 && user.apellido1.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.apellido2 && user.apellido2.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesRoles && matchesCentro && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedCentro('');
    setSearchTerm('');
  };

  const filterFields: FilterField[] = [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por nombre o email...',
      value: searchTerm,
      onChange: setSearchTerm,
      showClear: true,
    },
    {
      id: 'roles',
      type: 'multiselect',
      placeholder: 'Filtrar por roles',
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
    },
    {
      id: 'centro',
      type: 'dropdown',
      placeholder: 'Filtrar por centro',
      value: selectedCentro,
      options: [
        { label: 'CJ Juveliber', value: 'CJ Juveliber' },
        { label: 'CJ La Balsa', value: 'CJ La Balsa' },
        { label: 'CJ Sotojoven', value: 'CJ Sotojoven' },
      ],
      onChange: setSelectedCentro,
      showClear: true,
    },
  ];

  return (
    <div className="members-page">
      <Toast ref={toast} />

      <div className="page-header">
        <div className="header-text">
          <h1>👥 Gestión de Usuarios</h1>
          <p className="header-subtitle">Administra y visualiza todos los usuarios del sistema.</p>
        </div>
      </div>

      {!currentUser && (
        <Message severity="warn" text="No tienes permisos para editar usuarios" className="mb-4" />
      )}

      <FilterHeader
        fields={filterFields}
        onClearAll={clearFilters}
        resultsCount={filteredUsers.length}
        resultsLabel="miembros"
      />

      <MembersTable
        users={filteredUsers}
        onEditUser={handleEditUser}
        canEditUser={canEditUser}
        loading={loading}
      />

      {selectedUser && (
        <UserEditDialog
          visible={dialogVisible}
          user={selectedUser}
          grupos={grupos}
          onHide={() => {
            setDialogVisible(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};
