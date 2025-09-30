// src/pages/Members.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';          // ✅ auth global
import { useUsers } from '../hooks/useApi';           // ✅ hook especializado
import { User, RegisterData } from '../services/api';

import { MemberCard } from '../components/common/MemberCard';
import { UserDetailsDialog } from '../components/common/UserDetailsDialog';
import { UserFormDialog } from '../components/common/UserFormDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

type FilterState = {
  search: string;
  rol: number | null;
  centro: string | null;
  hasAccess: boolean | null;
};

export const Members: React.FC = () => {
  /* ------------  context & hooks  ------------ */
  const { user: currentUser, hasPermission, canCreateUsers } = useAuth();
  const {
    users,
    loading,
    error,
    fetchAllUsers,
    createNewUser,
    updateExistingUser,
  } = useUsers();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  /* ------------  local state  ------------ */
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    rol: null,
    centro: null,
    hasAccess: null,
  });
  const [formVisible, setFormVisible] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /* ------------  initial load  ------------ */
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  /* ------------  helpers  ------------ */
  const showToast = (severity: 'success' | 'error', summary: string, detail: string) =>
    toast.current?.show({ severity, summary, detail, life: 3000 });

  const handleFilter = (field: keyof FilterState, value: any) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () =>
    setFilters({ search: '', rol: null, centro: null, hasAccess: null });

  /* ------------  CRUD actions  ------------ */
  const saveUser = async (data: RegisterData) => {
    try {
      if (selectedUser) {
        await updateExistingUser(selectedUser.id, data);
        showToast('success', 'Actualizado', 'Usuario actualizado');
      } else {
        await createNewUser(data);
        showToast('success', 'Creado', 'Usuario creado');
      }
      setFormVisible(false);
    } catch (err: any) {
      showToast('error', 'Error', err.message);
    }
  };

  /* ------------  UI handlers  ------------ */
  const openNew = () => {
    setSelectedUser(null);
    setViewMode(false);
    setFormVisible(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setViewMode(false);
    setFormVisible(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewMode(true);
    setFormVisible(true);
  };

  /* ------------  filtering  ------------ */
  const filtered = users.filter((u) => {
    /* search */
    if (filters.search) {
      const txt = filters.search.toLowerCase();
      const full = `${u.nombre} ${u.apellido1} ${u.apellido2 ?? ''}`.toLowerCase();
      if (!full.includes(txt) && !(u.email ?? '').toLowerCase().includes(txt)) return false;
    }
    /* rol */
    if (filters.rol !== null && u.rol_id !== filters.rol) return false;
    /* centro */
    if (filters.centro && u.centro_juvenil !== filters.centro) return false;
    /* acceso */
    if (filters.hasAccess !== null) {
      const hasAcc = !!(u.email && u.can_login);
      if (hasAcc !== filters.hasAccess) return false;
    }
    return true;
  });

  const canShowEdit = hasPermission(3); // superuser-director-coordinador

  /* ------------  render  ------------ */
  if (loading) return <LoadingSpinner message="Cargando usuarios..." />;
  if (error)
    return <div className="text-center text-red-600 py-8">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        {canCreateUsers() && (
          <Button icon="pi pi-plus" label="Crear usuario" onClick={openNew} />
        )}
      </div>

      {/* filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <span className="p-input-icon-left col-span-2">
          <i className="pi pi-search" />
          <InputText
            value={filters.search}
            onChange={(e) => handleFilter('search', e.target.value)}
            placeholder="Buscar..."
            className="w-full"
          />
        </span>
        <Dropdown
          value={filters.rol}
          onChange={(e) => handleFilter('rol', e.value)}
          options={[
            { label: 'Todos los roles', value: null },
            { label: 'Superusuario', value: 1 },
            { label: 'Director', value: 2 },
            { label: 'Coordinador', value: 3 },
            { label: 'Animador', value: 4 },
            { label: 'Miembro', value: 5 },
          ]}
          placeholder="Rol"
          className="w-full"
        />
        <Button
          icon="pi pi-filter-slash"
          label="Limpiar"
          className="p-button-outlined"
          onClick={clearFilters}
        />
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="font-medium">Total</p>
          <h2>{filtered.length}</h2>
        </Card>
        <Card>
          <p className="font-medium">Con acceso</p>
          <h2>{filtered.filter((u) => u.email && u.can_login).length}</h2>
        </Card>
        <Card>
          <p className="font-medium">Animadores</p>
          <h2>{filtered.filter((u) => u.rol_id === 4).length}</h2>
        </Card>
        <Card>
          <p className="font-medium">Miembros</p>
          <h2>{filtered.filter((u) => u.rol_id === 5).length}</h2>
        </Card>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <i className="pi pi-users text-4xl text-gray-400 mb-4"></i>
          <p className="mb-2">
            {filters.search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
          </p>
          {canCreateUsers() && (
            <Button label="Crear usuario" icon="pi pi-plus" onClick={openNew} />
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filtered.map((u) => (
            <div
              key={u.id}
              style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 280 }}
            >
              <MemberCard
                user={u}
                currentUser={currentUser!}
                onView={handleView}
                onEdit={handleEdit}
                showEditButton={canShowEdit}
              />
            </div>
          ))}
        </div>
      )}

      {/* dialogs */}
      {formVisible && (
        <UserFormDialog
          visible={formVisible}
          user={selectedUser}
          viewMode={viewMode}
          onHide={() => setFormVisible(false)}
          onSave={saveUser}
        />
      )}

      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};
