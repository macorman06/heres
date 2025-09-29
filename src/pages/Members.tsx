import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FloatingActionButton } from '../components/members/FloatingActionButton';
import { UserDialog } from '../components/members/UserDialog';
import { MemberDialog } from '../components/members/MemberDialog';
import { useAuth } from '../hooks/useAuth';
import { apiService, User, Member, CreateUserRequest, CreateMemberRequest, ApiError } from '../services/api';
import { useRef } from 'react';

export const Members: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Dialog states
  const [userDialogVisible, setUserDialogVisible] = useState(false);
  const [memberDialogVisible, setMemberDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const { hasPermission, user: currentUser } = useAuth();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, globalFilter, roleFilter, sectionFilter]);

  useEffect(() => {
    filterMembers();
  }, [members, globalFilter, sectionFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, membersData] = await Promise.all([
        apiService.getUsers(),
        apiService.getMembers()
      ]);
      setUsers(usersData);
      setMembers(membersData);
    } catch (error) {
      const apiError = error as ApiError;
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: apiError.message || 'Error al cargar los datos',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (globalFilter) {
      filtered = filtered.filter(user =>
        user.nombre.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        (user.apellido1 && user.apellido1.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (user.apellido2 && user.apellido2.toLowerCase().includes(globalFilter.toLowerCase()))
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.rol_id.toString() === roleFilter);
    }

    if (sectionFilter) {
      filtered = filtered.filter(user => 
        user.seccion && user.seccion.includes(sectionFilter)
      );
    }

    setFilteredUsers(filtered);
  };

  const filterMembers = () => {
    let filtered = members;

    if (globalFilter) {
      filtered = filtered.filter(member =>
        member.nombre.toLowerCase().includes(globalFilter.toLowerCase()) ||
        member.apellido1.toLowerCase().includes(globalFilter.toLowerCase()) ||
        (member.apellido2 && member.apellido2.toLowerCase().includes(globalFilter.toLowerCase())) ||
        member.centro_juvenil.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (sectionFilter) {
      filtered = filtered.filter(member => member.seccion === sectionFilter);
    }

    setFilteredMembers(filtered);
  };

  // User CRUD operations
  const handleCreateUser = async (userData: CreateUserRequest) => {
    setActionLoading(true);
    try {
      const newUser = await apiService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente',
        life: 3000
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: apiError.message || 'Error al crear el usuario',
        life: 5000
      });
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (userData: CreateUserRequest) => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    try {
      const updatedUser = await apiService.updateUser(selectedUser.id, userData);
      setUsers(prev => prev.map(user => user.id === selectedUser.id ? updatedUser : user));
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente',
        life: 3000
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: apiError.message || 'Error al actualizar el usuario',
        life: 5000
      });
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No puedes eliminar tu propia cuenta',
        life: 3000
      });
      return;
    }

    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar al usuario "${user.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        setActionLoading(true);
        try {
          await apiService.deleteUser(user.id);
          setUsers(prev => prev.filter(u => u.id !== user.id));
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario eliminado correctamente',
            life: 3000
          });
        } catch (error) {
          const apiError = error as ApiError;
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: apiError.message || 'Error al eliminar el usuario',
            life: 5000
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // Member CRUD operations
  const handleCreateMember = async (memberData: CreateMemberRequest) => {
    setActionLoading(true);
    try {
      const newMember = await apiService.createMember(memberData);
      setMembers(prev => [...prev, newMember]);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Miembro creado correctamente',
        life: 3000
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: apiError.message || 'Error al crear el miembro',
        life: 5000
      });
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMember = async (memberData: CreateMemberRequest) => {
    if (!selectedMember) return;
    
    setActionLoading(true);
    try {
      const updatedMember = await apiService.updateMember(selectedMember.id, memberData);
      setMembers(prev => prev.map(member => member.id === selectedMember.id ? updatedMember : member));
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Miembro actualizado correctamente',
        life: 3000
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: apiError.message || 'Error al actualizar el miembro',
        life: 5000
      });
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMember = (member: Member) => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar al miembro "${member.nombre} ${member.apellido1}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        setActionLoading(true);
        try {
          await apiService.deleteMember(member.id);
          setMembers(prev => prev.filter(m => m.id !== member.id));
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Miembro eliminado correctamente',
            life: 3000
          });
        } catch (error) {
          const apiError = error as ApiError;
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: apiError.message || 'Error al eliminar el miembro',
            life: 5000
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // Dialog handlers
  const openUserDialog = (user?: User) => {
    setSelectedUser(user || null);
    setUserDialogVisible(true);
  };

  const openMemberDialog = (member?: Member) => {
    setSelectedMember(member || null);
    setMemberDialogVisible(true);
  };

  const closeUserDialog = () => {
    setUserDialogVisible(false);
    setSelectedUser(null);
  };

  const closeMemberDialog = () => {
    setMemberDialogVisible(false);
    setSelectedMember(null);
  };

  // Template functions
  const avatarBodyTemplate = (rowData: User | Member) => {
    const name = 'nombre' in rowData ? rowData.nombre : '';
    return (
      <Avatar
        label={name.charAt(0)}
        size="normal"
        shape="circle"
        className="bg-red-500 text-white"
      />
    );
  };

  const roleBodyTemplate = (user: User) => {
    const roleLabels = {
      1: { label: 'Superusuario', severity: 'danger' as const },
      2: { label: 'Director', severity: 'warning' as const },
      3: { label: 'Coordinador', severity: 'info' as const },
      4: { label: 'Animador', severity: 'success' as const },
      5: { label: 'Miembro', severity: 'secondary' as const }
    };

    const role = roleLabels[user.rol_id as keyof typeof roleLabels] || { label: 'Desconocido', severity: 'secondary' as const };
    return <Badge value={role.label} severity={role.severity} />;
  };

  const sectionBodyTemplate = (rowData: User | Member) => {
    if ('seccion' in rowData && Array.isArray(rowData.seccion)) {
      return rowData.seccion.map((section, index) => (
        <Badge key={index} value={section} className="mr-1 bg-blue-100 text-blue-800" />
      ));
    } else if ('seccion' in rowData && typeof rowData.seccion === 'string') {
      return <Badge value={rowData.seccion} className="bg-blue-100 text-blue-800" />;
    }
    return null;
  };

  const userActionBodyTemplate = (user: User) => {
    const canEdit = hasPermission('edit', 'users');
    const canDelete = hasPermission('delete', 'users') && user.id !== currentUser?.id;

    return (
      <div className="flex space-x-2">
        {canEdit && (
          <Button
            icon="pi pi-pencil"
            size="small"
            tooltip="Editar usuario"
            className="bg-red-600 border-red-600"
            onClick={() => openUserDialog(user)}
            disabled={actionLoading}
          />
        )}
        {canDelete && (
          <Button
            icon="pi pi-trash"
            size="small"
            severity="danger"
            tooltip="Eliminar usuario"
            onClick={() => handleDeleteUser(user)}
            disabled={actionLoading}
          />
        )}
      </div>
    );
  };

  const memberActionBodyTemplate = (member: Member) => {
    const canManage = hasPermission('edit', 'members');

    return (
      <div className="flex space-x-2">
        {canManage && (
          <>
            <Button
              icon="pi pi-pencil"
              size="small"
              tooltip="Editar miembro"
              className="bg-green-600 border-green-600"
              onClick={() => openMemberDialog(member)}
              disabled={actionLoading}
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              tooltip="Eliminar miembro"
              onClick={() => handleDeleteMember(member)}
              disabled={actionLoading}
            />
          </>
        )}
      </div>
    );
  };

  // Filter options
  const roleOptions = [
    { label: 'Todos los roles', value: '' },
    { label: 'Superusuario', value: '1' },
    { label: 'Director', value: '2' },
    { label: 'Coordinador', value: '3' },
    { label: 'Animador', value: '4' },
    { label: 'Miembro', value: '5' }
  ];

  const sectionOptions = [
    { label: 'Todas las secciones', value: '' },
    { label: 'J1', value: 'J1' },
    { label: 'J2', value: 'J2' },
    { label: 'J3', value: 'J3' },
    { label: 'Chiqui', value: 'Chiqui' },
    { label: 'CJ', value: 'CJ' }
  ];

  if (loading) {
    return <LoadingSpinner message="Cargando miembros y usuarios..." />;
  }

  const usersHeader = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        Usuarios del Sistema ({filteredUsers.length})
      </h3>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar usuarios..."
            className="pl-10"
          />
        </div>
        <Dropdown
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.value)}
          options={roleOptions}
          placeholder="Rol"
          className="w-full sm:w-auto"
        />
        <Dropdown
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.value)}
          options={sectionOptions}
          placeholder="Sección"
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );

  const membersHeader = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        Miembros ({filteredMembers.length})
      </h3>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar miembros..."
            className="pl-10"
          />
        </div>
        <Dropdown
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.value)}
          options={sectionOptions}
          placeholder="Sección"
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Gestión de Miembros</h1>
        <p className="text-red-100 dark:text-red-200">
          Administra usuarios del sistema y miembros del centro juvenil
        </p>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          <TabPanel header={`Usuarios (${users.length})`} leftIcon="pi pi-user">
            <div className="mb-4">{usersHeader}</div>
            <DataTable
              value={filteredUsers}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
              emptyMessage="No se encontraron usuarios"
              responsiveLayout="scroll"
              loading={actionLoading}
            >
              <Column body={avatarBodyTemplate} style={{ width: '4rem' }} />
              <Column 
                field="nombre" 
                header="Nombre" 
                sortable 
                body={(user) => `${user.nombre} ${user.apellido1 || ''} ${user.apellido2 || ''}`.trim()}
              />
              <Column field="email" header="Email" sortable />
              <Column body={roleBodyTemplate} header="Rol" sortable />
              <Column body={sectionBodyTemplate} header="Secciones" />
              <Column field="edad" header="Edad" sortable />
              <Column body={userActionBodyTemplate} header="Acciones" style={{ width: '8rem' }} />
            </DataTable>
          </TabPanel>

          <TabPanel header={`Miembros (${members.length})`} leftIcon="pi pi-users">
            <div className="mb-4">{membersHeader}</div>
            <DataTable
              value={filteredMembers}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
              emptyMessage="No se encontraron miembros"
              responsiveLayout="scroll"
              loading={actionLoading}
            >
              <Column body={avatarBodyTemplate} style={{ width: '4rem' }} />
              <Column 
                field="nombre" 
                header="Nombre" 
                sortable 
                body={(member) => `${member.nombre} ${member.apellido1} ${member.apellido2 || ''}`.trim()}
              />
              <Column field="centro_juvenil" header="Centro" sortable />
              <Column body={sectionBodyTemplate} header="Sección" sortable />
              <Column field="edad" header="Edad" sortable />
              <Column field="telefono" header="Teléfono" />
              <Column body={memberActionBodyTemplate} header="Acciones" style={{ width: '8rem' }} />
            </DataTable>
          </TabPanel>
        </TabView>
      </Card>

      {/* Floating Action Button */}
      <FloatingActionButton
        onAddUser={() => openUserDialog()}
        onAddMember={() => openMemberDialog()}
      />

      {/* User Dialog */}
      <UserDialog
        visible={userDialogVisible}
        onHide={closeUserDialog}
        onSave={selectedUser ? handleUpdateUser : handleCreateUser}
        user={selectedUser}
        loading={actionLoading}
      />

      {/* Member Dialog */}
      <MemberDialog
        visible={memberDialogVisible}
        onHide={closeMemberDialog}
        onSave={selectedMember ? handleUpdateMember : handleCreateMember}
        member={selectedMember}
        loading={actionLoading}
      />
    </div>
  );
};