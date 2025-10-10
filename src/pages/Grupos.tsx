import React, { useEffect, useState, useRef } from 'react';
import { useGroups } from '../hooks/useApi';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Grupo, FormData, User } from '../types';
import { centroJuvenilOptions, seccionOptions } from '../types/general.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const Grupos: React.FC = () => {
  const { groups, loading, error, fetchAllGroups, createGroup, updateGroup, deleteGroup } =
    useGroups();

  // Estados para diálogos
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayMembersDialog, setDisplayMembersDialog] = useState(false);
  const [displayDeleteGroupDialog, setDisplayDeleteGroupDialog] = useState(false);
  const [displayDeleteMemberDialog, setDisplayDeleteMemberDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Estados para grupos y usuarios
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Grupo | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<{ grupo: Grupo; usuario: User } | null>(
    null
  );

  // Form data
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    centro_juvenil: '',
    seccion: '',
  });

  // Refs
  const toast = useRef<Toast>(null);
  const menuRefs = useRef<{ [key: number]: Menu | null }>({});

  useEffect(() => {
    fetchAllGroups();
  }, [fetchAllGroups]);

  // Obtener todos los usuarios del sistema
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_BASE_URL}/usuarios/list`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.msg || 'Error al cargar usuarios');
      }

      const data = await response.json();
      setAllUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudieron cargar los usuarios',
        life: 3000,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Abrir diálogo para crear grupo
  const openCreateDialog = () => {
    setIsEditMode(false);
    setSelectedGrupo(null);
    setFormData({ nombre: '', centro_juvenil: '', seccion: '' });
    setDisplayDialog(true);
  };

  // Abrir diálogo para editar grupo
  const openEditDialog = (grupo: Grupo) => {
    setIsEditMode(true);
    setSelectedGrupo(grupo);
    setFormData({
      nombre: grupo.nombre,
      centro_juvenil: grupo.centro_juvenil,
      seccion: grupo.seccion,
    });
    setDisplayDialog(true);
  };

  // Abrir diálogo para gestionar miembros
  const openMembersDialog = async (grupo: Grupo) => {
    setSelectedGrupo(grupo);
    const currentMemberIds = grupo.usuarios.map((u) => u.id);
    setSelectedMembers(currentMemberIds);
    await fetchAllUsers();
    setDisplayMembersDialog(true);
  };

  // Guardar grupo (crear o editar)
  const handleSave = async () => {
    try {
      if (isEditMode && selectedGrupo) {
        await updateGroup(selectedGrupo.id, formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo actualizado correctamente',
          life: 3000,
        });
      } else {
        await createGroup(formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo creado correctamente',
          life: 3000,
        });
      }
      setDisplayDialog(false);
      fetchAllGroups();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el grupo',
        life: 3000,
      });
    }
  };

  // Guardar cambios de miembros
  const handleSaveMembers = async () => {
    if (!selectedGrupo) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/grupos/${selectedGrupo.id}/miembros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_ids: selectedMembers }),
      });

      if (!response.ok) throw new Error('Error al actualizar miembros');

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Miembros actualizados correctamente',
        life: 3000,
      });

      setDisplayMembersDialog(false);
      fetchAllGroups();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron actualizar los miembros',
        life: 3000,
      });
    }
  };

  // Abrir diálogo para eliminar grupo
  const confirmDeleteGroup = (grupo: Grupo) => {
    setGroupToDelete(grupo);
    setDisplayDeleteGroupDialog(true);
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await deleteGroup(groupToDelete.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Grupo eliminado correctamente',
        life: 3000,
      });
      fetchAllGroups();
      setDisplayDeleteGroupDialog(false);
      setGroupToDelete(null);
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el grupo',
        life: 3000,
      });
    }
  };

  // Abrir diálogo para eliminar miembro
  const confirmRemoveMember = (grupo: Grupo, usuario: User) => {
    setMemberToDelete({ grupo, usuario });
    setDisplayDeleteMemberDialog(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/grupos/${memberToDelete.grupo.id}/usuarios/${memberToDelete.usuario.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Error al eliminar miembro');

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Miembro eliminado del grupo',
        life: 3000,
      });

      fetchAllGroups();
      setDisplayDeleteMemberDialog(false);
      setMemberToDelete(null);
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el miembro',
        life: 3000,
      });
    }
  };

  // Toggle expansión de lista
  const toggleExpand = (grupoId: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(grupoId)) {
        newSet.delete(grupoId);
      } else {
        newSet.add(grupoId);
      }
      return newSet;
    });
  };

  // Menú contextual para cada grupo
  const getMenuItems = (grupo: Grupo) => [
    {
      label: 'Editar grupo',
      icon: 'pi pi-pencil',
      command: () => openEditDialog(grupo),
    },
    {
      label: 'Añadir miembros',
      icon: 'pi pi-users',
      command: () => openMembersDialog(grupo),
    },
    {
      separator: true,
    },
    {
      label: 'Eliminar grupo',
      icon: 'pi pi-trash',
      command: () => confirmDeleteGroup(grupo),
      className: 'text-red-500',
    },
  ];

  // Template para usuarios en MultiSelect
  const userOptionTemplate = (option: User) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div>
        <div style={{ fontWeight: 500 }}>
          {option.nombre} {option.apellido1} {option.apellido2}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {option.email}
          {option.centro_juvenil && ` • ${option.centro_juvenil}`}
        </div>
      </div>
    </div>
  );

  // Renderizar contenido de la card
  const renderCardContent = (grupo: Grupo) => {
    const isExpanded = expandedGroups.has(grupo.id);
    const visibleUsers = isExpanded ? grupo.usuarios : grupo.usuarios.slice(0, 5);
    const hasMore = grupo.usuarios.length > 5;

    return (
      <div className="grupo-card-content">
        {/* Header con nombre y chip de sección */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{grupo.nombre}</h3>
          <Chip
            label={grupo.seccion || 'N/A'}
            style={{
              backgroundColor: grupo.seccion === 'CJ' ? '#3b82f6' : '#10b981',
              color: 'white',
            }}
          />
        </div>

        {/* Lista de usuarios */}
        <div style={{ marginBottom: '1rem' }}>
          {visibleUsers.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic', margin: 0 }}>Sin miembros</p>
          ) : (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {visibleUsers.map((usuario) => (
                <li
                  key={usuario.id}
                  onMouseEnter={() => setHoveredUserId(usuario.id)}
                  onMouseLeave={() => setHoveredUserId(null)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.2s',
                    backgroundColor: hoveredUserId === usuario.id ? '#f3f4f6' : 'transparent',
                  }}
                >
                  <span>
                    {usuario.nombre} {usuario.apellido1}
                  </span>
                  {hoveredUserId === usuario.id && (
                    <Button
                      icon="pi pi-times"
                      rounded
                      text
                      severity="danger"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmRemoveMember(grupo, usuario);
                      }}
                      style={{ width: '1.5rem', height: '1.5rem' }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Botón para expandir/colapsar si hay más de 5 */}
          {hasMore && (
            <Button
              label={isExpanded ? 'Ver menos' : `Ver ${grupo.usuarios.length - 5} más`}
              text
              size="small"
              onClick={() => toggleExpand(grupo.id)}
              style={{ marginTop: '0.5rem', padding: 0 }}
            />
          )}
        </div>

        {/* Footer con menú de opciones */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '0.5rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Button
            icon="pi pi-ellipsis-v"
            rounded
            text
            onClick={(e) => menuRefs.current[grupo.id]?.toggle(e)}
            aria-label="Opciones"
          />
          <Menu model={getMenuItems(grupo)} popup ref={(el) => (menuRefs.current[grupo.id] = el)} />
        </div>
      </div>
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Añadir estado para ordenación
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Función para ordenar
  const getSortedGroups = () => {
    const sorted = [...groups].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.nombre.localeCompare(b.nombre);
      } else {
        return b.nombre.localeCompare(a.nombre);
      }
    });
    return sorted;
  };

  // Cambiar el toggle de orden
  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) {
    return (
      <div className="grupos-container">
        {[1, 2, 3].map((i) => (
          <Card key={i} style={{ marginBottom: '1rem' }}>
            <Skeleton height="150px" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grupos-container">
      <Toast ref={toast} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Grupos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona y consulta los grupos.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            label={sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            icon={sortOrder === 'asc' ? 'pi pi-sort-alpha-down' : 'pi pi-sort-alpha-up'}
            onClick={toggleSort}
            className="btn-secondary"
          />
          <Button
            label="Crear Grupo"
            icon="pi pi-plus"
            onClick={openCreateDialog}
            className="btn-primary"
          />
        </div>
      </div>

      {/* Usar getSortedGroups() en lugar de groups */}
      <div className="grupos-grid">
        {getSortedGroups().map((grupo) => (
          <Card key={grupo.id} className="grupo-card">
            {renderCardContent(grupo)}
          </Card>
        ))}
      </div>

      {/* Dialog para crear/editar grupo */}
      <Dialog
        header={isEditMode ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
        visible={displayDialog}
        style={{ width: '450px' }}
        onHide={() => setDisplayDialog(false)}
        modal
        draggable={false}
        resizable={false}
        maskClassName="dialog-dark-mask"
        footer={
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setDisplayDialog(false)}
              className="btn-secondary"
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={handleSave}
              autoFocus
              className="btn-primary"
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field" style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="nombre"
              style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
            >
              Nombre *
            </label>
            <InputText
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Grupo A1"
              required
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div className="p-field">
              <label
                htmlFor="centro_juvenil"
                style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
              >
                Centro Juvenil *
              </label>
              <Dropdown
                id="centro_juvenil"
                name="centro_juvenil"
                value={formData.centro_juvenil}
                options={centroJuvenilOptions}
                onChange={(e) => handleDropdownChange('centro_juvenil', e.value)}
                placeholder="Centro"
                required
              />
            </div>

            <div className="p-field">
              <label
                htmlFor="seccion"
                style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
              >
                Sección *
              </label>
              <Dropdown
                id="seccion"
                name="seccion"
                value={formData.seccion}
                options={seccionOptions}
                onChange={(e) => handleDropdownChange('seccion', e.value)}
                placeholder="Sección"
                required
              />
            </div>
          </div>
        </div>
      </Dialog>

      {/* Dialog para gestionar miembros */}
      <Dialog
        header={`Gestionar miembros: ${selectedGrupo?.nombre || ''}`}
        visible={displayMembersDialog}
        style={{ width: '600px' }}
        onHide={() => setDisplayMembersDialog(false)}
        modal
        draggable={false}
        resizable={false}
        maskClassName="dialog-dark-mask"
        footer={
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setDisplayMembersDialog(false)}
              className="btn-secondary"
            />
            <Button
              label="Guardar Cambios"
              icon="pi pi-check"
              onClick={handleSaveMembers}
              autoFocus
              className="btn-primary"
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label
              htmlFor="members"
              style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
            >
              Selecciona los miembros del grupo
            </label>
            <small style={{ display: 'block', marginBottom: '0.75rem', color: '#6b7280' }}>
              Puedes seleccionar múltiples usuarios.
            </small>

            {loadingUsers ? (
              <Skeleton height="200px" />
            ) : (
              <MultiSelect
                id="members"
                value={selectedMembers}
                options={allUsers}
                onChange={(e) => setSelectedMembers(e.value)}
                optionLabel="nombre"
                optionValue="id"
                placeholder="Selecciona usuarios..."
                filter
                filterPlaceholder="Buscar usuarios..."
                itemTemplate={userOptionTemplate}
                display="chip"
                maxSelectedLabels={3}
                style={{ width: '100%' }}
              />
            )}

            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              <i className="pi pi-info-circle" style={{ marginRight: '0.5rem' }}></i>
              {selectedMembers.length} usuario(s) seleccionado(s)
            </div>
          </div>
        </div>
      </Dialog>

      {/* Dialog para eliminar grupo */}
      <Dialog
        header="Confirmar eliminación"
        visible={displayDeleteGroupDialog}
        style={{ width: '450px' }}
        onHide={() => setDisplayDeleteGroupDialog(false)}
        modal
        draggable={false}
        resizable={false}
        maskClassName="dialog-dark-mask"
        footer={
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setDisplayDeleteGroupDialog(false)}
              className="btn-secondary"
            />
            <Button
              label="Sí, eliminar"
              icon="pi pi-check"
              onClick={handleDeleteGroup}
              autoFocus
              className="btn-primary"
            />
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: '2rem', color: '#f59e0b' }}
          ></i>
          <p style={{ margin: 0 }}>
            ¿Estás seguro de que quieres eliminar el grupo "{groupToDelete?.nombre}"?
          </p>
        </div>
      </Dialog>

      {/* Dialog para eliminar miembro */}
      <Dialog
        header="Eliminar miembro"
        visible={displayDeleteMemberDialog}
        style={{ width: '450px' }}
        onHide={() => setDisplayDeleteMemberDialog(false)}
        modal
        draggable={false}
        resizable={false}
        maskClassName="dialog-dark-mask"
        footer={
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setDisplayDeleteMemberDialog(false)}
              className="btn-secondary"
            />
            <Button
              label="Sí, eliminar"
              icon="pi pi-check"
              onClick={handleRemoveMember}
              autoFocus
              className="btn-primary"
            />
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: '2rem', color: '#f59e0b' }}
          ></i>
          <p style={{ margin: 0 }}>
            ¿Seguro que deseas eliminar a {memberToDelete?.usuario.nombre}{' '}
            {memberToDelete?.usuario.apellido1}?
          </p>
        </div>
      </Dialog>
    </div>
  );
};
