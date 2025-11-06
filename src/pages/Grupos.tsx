// src/pages/Grupos.tsx

import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { MultiSelect } from 'primereact/multiselect';
import { GrupoCard } from '../components/cards/GrupoCard/GrupoCard';
import { groupService, userService } from '../services/api/index';
import { Grupo, GrupoFormData } from '../types/group.types';
import type { User } from '../types/user.types';
import { centroJuvenilOptions, seccionOptions } from '../types/general.types';
import '../styles/4-pages/grupos.css';

export const Grupos: React.FC = () => {
  const toast = useRef<Toast>(null);

  // Estados
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayMembersDialog, setDisplayMembersDialog] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState<GrupoFormData>({
    nombre: '',
    centro_juvenil: '',
    seccion: '',
  });

  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los grupos',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await userService.getUsers();
      setAllUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleCreateGroup = () => {
    setIsEditMode(false);
    setFormData({ nombre: '', centro_juvenil: '', seccion: '' });
    setDisplayDialog(true);
  };

  const handleEditGroup = (grupo: Grupo) => {
    setIsEditMode(true);
    setSelectedGroup(grupo);
    setFormData({
      nombre: grupo.nombre,
      centro_juvenil: grupo.centro_juvenil,
      seccion: grupo.seccion,
    });
    setDisplayDialog(true);
  };

  const handleEditMembers = (grupo: Grupo) => {
    setSelectedGroup(grupo);
    setSelectedMembers(grupo.usuarios.map((u) => u.id));
    setDisplayMembersDialog(true);
  };

  const handleSaveMembers = async () => {
    if (!selectedGroup) return;

    try {
      console.log(`🔧 [Grupos] Guardando miembros del grupo ${selectedGroup.id}:`, selectedMembers);

      await groupService.updateGroupMembers(selectedGroup.id, selectedMembers);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Miembros actualizados correctamente',
        life: 3000,
      });

      setDisplayMembersDialog(false);
      fetchGroups();
    } catch (error: any) {
      console.error('❌ [Grupos] Error al actualizar miembros:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'No se pudieron actualizar los miembros',
        life: 3000,
      });
    }
  };

  const handleSaveGroup = async () => {
    try {
      if (isEditMode && selectedGroup) {
        await groupService.updateGroup(selectedGroup.id, formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo actualizado correctamente',
        });
      } else {
        await groupService.createGroup(formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo creado correctamente',
        });
      }
      setDisplayDialog(false);
      fetchGroups();
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al guardar grupo',
      });
    }
  };

  const handleDeleteGroup = (grupo: Grupo) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar el grupo "${grupo.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await groupService.deleteGroup(grupo.id);
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Grupo eliminado correctamente',
          });
          fetchGroups();
        } catch (error: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || 'Error al eliminar grupo',
          });
        }
      },
    });
  };

  const handleRemoveMember = async (grupoId: number, userId: number) => {
    try {
      const grupo = groups.find((g) => g.id === grupoId);
      if (!grupo) return;

      const newMembers = grupo.usuarios.filter((u) => u.id !== userId).map((u) => u.id);

      await groupService.updateGroupMembers(grupoId, newMembers);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado del grupo',
        life: 2000,
      });

      fetchGroups();
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el usuario del grupo',
      });
    }
  };

  const handleToggleResponsable = async (grupoId: number, userId: number) => {
    try {
      const grupo = groups.find((g) => g.id === grupoId);
      if (!grupo) return;

      const currentResponsables = grupo.responsables || [];
      let newResponsables: number[];

      if (currentResponsables.includes(userId)) {
        newResponsables = currentResponsables.filter((id) => id !== userId);
      } else {
        newResponsables = [...currentResponsables, userId];
      }

      setGroups((prevGroups) =>
        prevGroups.map((g) => (g.id === grupoId ? { ...g, responsables: newResponsables } : g))
      );

      await groupService.updateResponsables(grupoId, newResponsables);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Responsable actualizado correctamente',
        life: 2000,
      });
    } catch (error: any) {
      console.error('Error al actualizar responsable:', error);
      fetchGroups();
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al actualizar responsable',
      });
    }
  };

  const dialogFooter = (
    <div className="dialog-footer">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setDisplayDialog(false)}
        className="btn-secondary"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSaveGroup}
        className="btn-primary"
      />
    </div>
  );

  const membersDialogFooter = (
    <div className="dialog-footer">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setDisplayMembersDialog(false)}
        className="btn-secondary"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSaveMembers}
        className="btn-primary"
      />
    </div>
  );

  return (
    <div className="grupos-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="page-header">
        <div className="header-text">
          <h1>🫂 Grupos</h1>
          <p className="header-subtitle">Gestiona los grupos del centro juvenil.</p>
        </div>
        <Button
          label="Nuevo Grupo"
          icon="pi pi-plus"
          onClick={handleCreateGroup}
          className="btn-primary"
        />
      </div>

      {loading ? (
        <div className="grupos-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="300px" borderRadius="8px" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <i className="pi pi-users" />
          <h3>No hay grupos creados</h3>
          <p>Crea tu primer grupo para empezar a organizar miembros</p>
          <Button label="Crear Grupo" icon="pi pi-plus" onClick={handleCreateGroup} />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
            padding: '1rem',
            width: '100%',
          }}
        >
          {groups.map((grupo) => (
            <GrupoCard
              key={grupo.id}
              id={grupo.id}
              nombre={grupo.nombre}
              centro_juvenil={grupo.centro_juvenil}
              seccion={grupo.seccion}
              usuarios={grupo.usuarios || []}
              responsables={grupo.responsables || []}
              onEdit={() => handleEditGroup(grupo)}
              onEditMembers={() => handleEditMembers(grupo)}
              onToggleResponsable={(userId) => handleToggleResponsable(grupo.id, userId)}
              onRemoveMember={(userId) => handleRemoveMember(grupo.id, userId)}
              onDelete={() => handleDeleteGroup(grupo)}
            />
          ))}
        </div>
      )}

      {/* Dialog crear/editar grupo */}
      <Dialog
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)}
        header={isEditMode ? 'Editar Grupo' : 'Nuevo Grupo'}
        footer={dialogFooter}
        style={{ width: '500px' }}
        breakpoints={{ '960px': '75vw', '641px': '95vw' }}
        modal
      >
        <div className="dialog-content">
          <div className="field">
            <label htmlFor="nombre">Nombre del Grupo *</label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Grupo Azul"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="centro">Centro Juvenil *</label>
            <Dropdown
              id="centro"
              value={formData.centro_juvenil}
              options={centroJuvenilOptions}
              onChange={(e) => setFormData({ ...formData, centro_juvenil: e.value })}
              placeholder="Selecciona un centro"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="seccion">Sección *</label>
            <Dropdown
              id="seccion"
              value={formData.seccion}
              options={seccionOptions}
              onChange={(e) => setFormData({ ...formData, seccion: e.value })}
              placeholder="Selecciona una sección"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog gestionar miembros */}
      <Dialog
        visible={displayMembersDialog}
        onHide={() => setDisplayMembersDialog(false)}
        header={`Gestionar miembros - ${selectedGroup?.nombre || ''}`}
        footer={membersDialogFooter}
        style={{ width: '600px' }}
        breakpoints={{ '960px': '75vw', '641px': '95vw' }}
        modal
      >
        <div className="dialog-content">
          <div className="field">
            <label htmlFor="members">Seleccionar Miembros</label>
            <MultiSelect
              id="members"
              value={selectedMembers}
              options={allUsers.map((user) => ({
                label: `${user.nombre} ${user.apellido1} (${user.rol})`,
                value: user.id,
              }))}
              onChange={(e) => setSelectedMembers(e.value)}
              placeholder="Selecciona los miembros del grupo"
              filter
              className="w-full"
              display="chip"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {selectedMembers.length} miembro(s) seleccionado(s)
          </p>
        </div>
      </Dialog>
    </div>
  );
};
