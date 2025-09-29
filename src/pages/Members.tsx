import React, { useState, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { User, CreateUserRequest } from '../services/api';
import { MemberCard } from '../components/common/MemberCard';
import { UserDetailsDialog } from '../components/common/UserDetailsDialog';
import { UserFormDialog } from '../components/common/UserFormDialog';

interface UserFormData {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email?: string;
  password?: string;
  rol_id: number;
  centro_juvenil?: string;
  seccion?: string;
  sexo?: 'M' | 'F';
  birthday?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

// ✅ FIX: Filter types for better organization
interface FilterState {
  search: string;
  rol: number | null;
  centro: string | null;
  hasAccess: boolean | null;
}

export const Members: React.FC = () => {
  const { hasPermission, canCreateUsers } = useAuth();
  const { users, usersLoading, usersError, createUser, updateUser } = useApi();

  // ✅ FIX: Advanced filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    rol: null,
    centro: null,
    hasAccess: null
  });

  const [userFormDialog, setUserFormDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedUser] = useState<User | null>(null); // ✅ FIX: Proper typing
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // ✅ FIX: Proper typing

  const toast = useRef<Toast>(null); // ✅ FIX: Proper typing

  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    password: '',
    rol_id: 5,
    centro_juvenil: 'CJ Juveliber',
    seccion: '', // ✅ FIXED: string vacío en lugar de array
    sexo: 'M',
    birthday: '',
    direccion: '',
    localidad: '',
    telefono: '',
    alergias: [],
    talla: 'M'
  });

  const showToast = useCallback((severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  }, []);

  // Show modal for new user
  const openNew = useCallback(() => {
    setFormData({
      nombre: '',
      apellido1: '',
      apellido2: '',
      email: '',
      password: '',
      rol_id: 5,
      centro_juvenil: 'CJ Juveliber',
      seccion: '', // ✅ FIXED: string vacío
      sexo: 'M',
      birthday: '',
      direccion: '',
      localidad: '',
      telefono: '',
      alergias: [],
      talla: 'M'
    });
    setEditMode(false);
    setViewMode(false);
    setCurrentUser(null);
    setUserFormDialog(true);
  }, []);

  // Show user in view-only mode (click on card)
  const handleViewUser = useCallback((user: User) => {
    setCurrentUser(user);
    setEditMode(false);
    setViewMode(true);
    setUserFormDialog(true);
  }, []);

  // Show modal for editing user (click on pencil)
  const handleEditUser = useCallback((user: User) => {
    console.log('Editing user:', user);

    setFormData({
      nombre: user.nombre || '',
      apellido1: user.apellido1 || '',
      apellido2: user.apellido2 || '',
      email: user.email || '',
      password: '',
      rol_id: user.rol_id || 5,
      centro_juvenil: user.centro_juvenil || 'CJ San Antonio',
      seccion: Array.isArray(user.seccion) ? user.seccion[0] || '' : user.seccion || '', // ✅ FIXED: Tomar solo el primer elemento si es array
      sexo: user.sexo || 'M',
      birthday: user.birthday || '',
      direccion: user.direccion || '',
      localidad: user.localidad || '',
      telefono: user.telefono || '',
      alergias: Array.isArray(user.alergias) ? user.alergias : [],
      talla: user.talla || 'M'
    });

    setEditMode(true);
    setViewMode(false);
    setCurrentUser(user);
    setUserFormDialog(true);
  }, []);

  // Handle form changes
  const handleFormChange = useCallback((field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // ✅ FIX: Handle filter changes
  const handleFilterChange = useCallback((field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      rol: null,
      centro: null,
      hasAccess: null
    });
  }, []);

  // Save user
  const saveUser = useCallback(async () => {
    try {
      if (!formData.nombre.trim() || !formData.apellido1.trim()) {
        showToast('error', 'Error', 'Nombre y apellido son obligatorios');
        return;
      }

      const userData: CreateUserRequest = {
        nombre: formData.nombre.trim(),
        apellido1: formData.apellido1.trim(),
        apellido2: formData.apellido2?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        password: formData.password?.trim() || undefined,
        rol_id: formData.rol_id,
        centro_juvenil: formData.centro_juvenil?.trim(),
        seccion: formData.seccion,
        sexo: formData.sexo,
        birthday: formData.birthday || undefined,
        direccion: formData.direccion?.trim(),
        localidad: formData.localidad?.trim(),
        telefono: formData.telefono?.trim(),
        alergias: formData.alergias,
        talla: formData.talla
      };

      if (editMode && currentUser) {
        await updateUser(currentUser.id, userData);
        showToast('success', 'Éxito', 'Usuario actualizado correctamente');
      } else {
        await createUser(userData);
        showToast('success', 'Éxito', 'Usuario creado correctamente');
      }

      setUserFormDialog(false);
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Error al guardar usuario');
    }
  }, [formData, editMode, currentUser, updateUser, createUser, showToast]);

  // ✅ FIX: Enhanced filtering with multiple criteria
  const filteredUsers = users?.filter(user => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = `${user.nombre} ${user.apellido1} ${user.apellido2 || ''}`.toLowerCase();
      const email = user.email?.toLowerCase() || '';
      const telefono = user.telefono || '';
      const localidad = user.localidad?.toLowerCase() || '';
      const rol = user.rol?.toLowerCase() || '';

      const matchesSearch = (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        telefono.includes(searchLower) ||
        localidad.includes(searchLower) ||
        rol.includes(searchLower)
      );

      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.rol !== null && user.rol_id !== filters.rol) {
      return false;
    }

    // Centro filter
    if (filters.centro && user.centro_juvenil !== filters.centro) {
      return false;
    }

    // Access filter
    if (filters.hasAccess !== null) {
      const hasAccess = Boolean(user.email && user.can_login);
      if (hasAccess !== filters.hasAccess) {
        return false;
      }
    }

    return true;
  }) || [];

  // Check if user can edit (superuser, director, coordinador)
  const canShowEditButton = hasPermission(3);

  // ✅ FIX: Filter options
  const roleOptions = [
    { label: 'Superusuario', value: 1 },
    { label: 'Director', value: 2 },
    { label: 'Coordinador', value: 3 },
    { label: 'Animador', value: 4 },
    { label: 'Miembro', value: 5 }
  ];

  const centroOptions = [
    { label: 'CJ Juveliber', value: 'CJ Juveliber' },
    { label: 'CJ San Antonio', value: 'CJ San Antonio' },
    { label: 'La Balsa', value: 'La Balsa' },
    { label: 'Sotojoven', value: 'Sotojoven' }
  ];

  const accessOptions = [
    { label: 'Con acceso', value: true },
    { label: 'Sin acceso', value: false }
  ];

  const hasActiveFilters = filters.search || filters.rol !== null || filters.centro !== null || filters.hasAccess !== null;

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center gap-4">
          <i className="pi pi-spin pi-spinner text-4xl text-red-500"></i>
          <p className="text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Usuarios
        </h2>

        <div className="flex gap-3 items-center">
          {canCreateUsers() && (
            <Button
              label="Nuevo Usuario"
              icon="pi pi-plus"
              onClick={openNew}
              className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white"
            />
          )}
        </div>
      </div>

      {/* ✅ NEW: Advanced Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Filter */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Buscar
            </label>
            <div className="relative">
              <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none"></i>
              <InputText
                type="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nombre, email, teléfono..."
                className="w-full pl-10 pr-4"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Rol
            </label>
            <Dropdown
              value={filters.rol}
              options={roleOptions}
              onChange={(e) => handleFilterChange('rol', e.value)}
              className="w-full"
              placeholder="Filtrar por rol"
            />
          </div>

          {/* Centro Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Centro
            </label>
            <Dropdown
              value={filters.centro}
              options={centroOptions}
              onChange={(e) => handleFilterChange('centro', e.value)}
              className="w-full"
              placeholder="Filtrar por centro"
            />
          </div>

          {/* Access Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Acceso
            </label>
            <Dropdown
              value={filters.hasAccess}
              options={accessOptions}
              onChange={(e) => handleFilterChange('hasAccess', e.value)}
              className="w-full"
              placeholder="Filtrar por acceso"
            />
          </div>
        </div>

        {/* Filter Actions */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredUsers.length} de {users?.length || 0} usuarios
            </p>
            <Button
              label="Limpiar filtros"
              icon="pi pi-times"
              onClick={clearFilters}
              outlined
              size="small"
            />
          </div>
        )}
      </div>

      {/* Error State */}
      {usersError && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
          <div className="flex items-center">
            <i className="pi pi-exclamation-triangle mr-2"></i>
            <strong>Error:</strong> {usersError}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Usuarios</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {filteredUsers.length}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Con Acceso</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {filteredUsers.filter(u => u.email && u.can_login).length}
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">Animadores</div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {filteredUsers.filter(u => u.rol_id <= 4).length}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Miembros</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {filteredUsers.filter(u => u.rol_id === 5).length}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <i className="pi pi-users text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {hasActiveFilters ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            {hasActiveFilters
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer usuario'
            }
          </p>
          {canCreateUsers() && !hasActiveFilters && (
            <Button
              label="Crear Usuario"
              icon="pi pi-plus"
              onClick={openNew}
              className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white"
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <MemberCard
              key={user.id}
              user={user}
              onView={handleViewUser}
              onEdit={handleEditUser}
              showEditButton={canShowEditButton}
            />
          ))}
        </div>
      )}

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        visible={detailsDialog}
        onHide={() => setDetailsDialog(false)}
      />

      {/* User Form Dialog */}
      <UserFormDialog
        visible={userFormDialog}
        user={currentUser}
        isEditMode={editMode}
        isViewMode={viewMode}
        formData={formData}
        onHide={() => setUserFormDialog(false)}
        onSave={!viewMode ? saveUser : undefined}
        onFormChange={!viewMode ? handleFormChange : undefined}
      />

    </div>
  );
};
