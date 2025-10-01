import React, { useEffect, useState } from 'react';
import { useGroups } from '../hooks/useApi';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Grupo, FormData } from '../types';

export const Grupos: React.FC = () => {
  const { groups, loading, error, fetchAllGroups, createGroup, updateGroup, deleteGroup } = useGroups();
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    centro_juvenil: '',
    seccion: ''
  });
  const toast = React.useRef<Toast>(null);

  useEffect(() => {
    fetchAllGroups();
  }, [fetchAllGroups]);

  // Manejar expansión de la tarjeta
  const handleCardClick = (grupoId: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      setExpandedCardId(expandedCardId === grupoId ? null : grupoId);
    }
  };

  const openCreateDialog = () => {
    setIsEditMode(false);
    setSelectedGrupo(null);
    setFormData({
      nombre: '',
      centro_juvenil: '',
      seccion: ''
    });
    setDisplayDialog(true);
  };

  const openEditDialog = (grupo: Grupo, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditMode(true);
    setSelectedGrupo(grupo);
    setFormData({
      nombre: grupo.nombre,
      centro_juvenil: grupo.centro_juvenil,
      seccion: grupo.seccion
    });
    setDisplayDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode && selectedGrupo) {
        await updateGroup(selectedGrupo.id, formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo actualizado correctamente',
          life: 3000
        });
      } else {
        await createGroup(formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo creado correctamente',
          life: 3000
        });
      }
      setDisplayDialog(false);
      fetchAllGroups();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el grupo',
        life: 3000
      });
    }
  };

  const confirmDelete = (grupo: Grupo, event: React.MouseEvent) => {
    event.stopPropagation();
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar el grupo "${grupo.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(grupo.id),
      reject: () => {},
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-danger'
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteGroup(id);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Grupo eliminado correctamente',
        life: 3000
      });
      fetchAllGroups();
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el grupo',
        life: 3000
      });
    }
  };

  const cardContent = (grupo: Grupo) => {
    const isExpanded = expandedCardId === grupo.id;

    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <i className="pi pi-users" />
          <Badge value={grupo.usuarios.length} severity="info" />
          <span className="text-sm text-gray-600">
            {grupo.usuarios.length === 1 ? 'miembro' : 'miembros'}
          </span>
        </div>

        {/* Lista de usuarios expandida */}
        {isExpanded && grupo.usuarios.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-sm mb-3 text-gray-700">Miembros del grupo:</h4>
            <ul className="space-y-2">
              {grupo.usuarios.map((usuario) => (
                <li
                  key={usuario.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <i className="pi pi-user text-xs text-gray-500" />
                  <span className="text-sm">
                    {usuario.nombre} {usuario.apellido1} {usuario.apellido2}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isExpanded && grupo.usuarios.length === 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            No hay miembros en este grupo
          </div>
        )}

        {/* Indicador de expansión */}
        <div className="flex justify-center mt-3">
          <i className={`pi ${isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'} text-xs text-gray-400`} />
        </div>
      </div>
    );
  };

  // Pie de la tarjeta con botones de acción
  const cardFooter = (grupo: Grupo) => (
    <div className="flex gap-2 justify-end">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        onClick={(e) => openEditDialog(grupo, e)}
        tooltip="Editar"
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        onClick={(e) => confirmDelete(grupo, e)}
        tooltip="Eliminar"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton width="300px" height="2rem" className="mb-2" />
          <Skeleton width="400px" height="1rem" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="200px" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Grupos</h1>
          <p className="text-gray-600">
            Gestiona y consulta los grupos a los que perteneces.
          </p>
        </div>
        <Button
          label="Crear Grupo"
          icon="pi pi-plus"
          onClick={openCreateDialog}
          className="p-button-success"
        />
      </div>

      {groups.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Aún no se han creado grupos en el sistema
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {groups.map((grupo) => (
            <div
              key={grupo.id}
              style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 280 }}
            >
              <Card
                title={grupo.nombre}
                subTitle={`${grupo.seccion} - ${grupo.centro_juvenil}`}
                footer={cardFooter(grupo)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={(e) => handleCardClick(grupo.id, e)}
                style={{
                  transition: 'all 0.3s ease',
                  minHeight: expandedCardId === grupo.id ? 'auto' : '200px'
                }}
              >
                {cardContent(grupo)}
              </Card>
            </div>
          ))}
        </div>
      )}

      <Dialog
        header={isEditMode ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
        visible={displayDialog}
        style={{ width: '450px' }}
        onHide={() => setDisplayDialog(false)}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setDisplayDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={handleSave}
              disabled={!formData.nombre.trim()}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="nombre" className="block mb-2 font-semibold">
              Nombre *
            </label>
            <InputText
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Nombre del grupo"
              required
            />
          </div>
          <div>
            <label htmlFor="centro_juvenil" className="block mb-2 font-semibold">
              Centro Juvenil
            </label>
            <InputText
              id="centro_juvenil"
              name="centro_juvenil"
              value={formData.centro_juvenil}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Centro juvenil"
            />
          </div>
          <div>
            <label htmlFor="seccion" className="block mb-2 font-semibold">
              Sección
            </label>
            <InputText
              id="seccion"
              name="seccion"
              value={formData.seccion}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Sección"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
