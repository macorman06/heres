// src/components/dialog/CreateTaskDialog/CreateTaskDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { UserAvatar } from '../../common/UserAvatar';
import { tareasService, CreateTareaDTO, userService } from '../../../services/api/index';

interface CreateTaskDialogProps {
  visible: boolean;
  actividadId: number;
  actividadNombre: string;
  onHide: () => void;
  onSuccess: () => void;
}

interface UsuarioOption {
  label: string;
  value: number;
  nombre: string;
  apellido1?: string;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  visible,
  actividadId,
  actividadNombre,
  onHide,
  onSuccess,
}) => {
  const toast = React.useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usuariosOptions, setUsuariosOptions] = useState<UsuarioOption[]>([]);

  const [formData, setFormData] = useState<Partial<CreateTareaDTO>>({
    nombre: '',
    descripcion: '',
    actividad_id: actividadId,
    usuarios_asignados_ids: [],
    fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'Por hacer',
    prioridad: 'Media',
    etiquetas: [],
  });

  useEffect(() => {
    if (visible) {
      cargarUsuarios();
      setFormData((prev) => ({
        ...prev,
        actividad_id: actividadId,
      }));
    }
  }, [visible, actividadId]);

  const cargarUsuarios = async () => {
    try {
      setLoadingUsers(true);
      const usuariosData = await userService.getUsers();

      // Crear opciones con todos los datos necesarios
      const options: UsuarioOption[] = usuariosData.map((user: any) => ({
        label: `${user.nombre} ${user.apellido1 || ''}`.trim(),
        value: user.id,
        nombre: user.nombre,
        apellido1: user.apellido1,
      }));

      setUsuariosOptions(options);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la lista de usuarios',
        life: 3000,
      });
      setUsuariosOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre?.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre de la tarea es obligatorio',
        life: 3000,
      });
      return;
    }

    if (!formData.usuarios_asignados_ids || formData.usuarios_asignados_ids.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe asignar al menos una persona',
        life: 3000,
      });
      return;
    }

    if (!formData.fecha_vencimiento) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La fecha de vencimiento es obligatoria',
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await tareasService.crear(formData as CreateTareaDTO);
      toast.current?.show({
        severity: 'success',
        summary: 'Tarea creada',
        detail: 'La tarea se ha creado correctamente',
        life: 3000,
      });

      setFormData({
        nombre: '',
        descripcion: '',
        actividad_id: actividadId,
        usuarios_asignados_ids: [],
        fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'Por hacer',
        prioridad: 'Media',
        etiquetas: [],
      });

      onSuccess();
      onHide();
    } catch (error: any) {
      console.error('Error creando tarea:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.error || 'Error al crear la tarea',
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const prioridadOptions = [
    { label: 'Baja', value: 'Baja' },
    { label: 'Media', value: 'Media' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Crítica', value: 'Crítica' },
  ];

  // ✅ Template para items en el dropdown
  const userItemTemplate = (option: UsuarioOption) => {
    return (
      <div className="flex align-items-center gap-2 p-2">
        <UserAvatar userId={option.value} size="small" />
        <span>
          {option.nombre} {option.apellido1 || ''}
        </span>
      </div>
    );
  };

  // ✅ Template para chips seleccionados
  const selectedUserTemplate = (value: number) => {
    const usuario = usuariosOptions.find((u) => u.value === value);
    if (!usuario) return value;

    return (
      <div className="flex align-items-center gap-1">
        <UserAvatar userId={usuario.value} size="small" />
        <span>{usuario.nombre}</span>
      </div>
    );
  };

  const footer = (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-secondary"
        disabled={loading}
      />
      <Button
        label="Crear Tarea"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
        autoFocus
        className="p-button-primary"
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Crear Tarea"
        footer={footer}
        style={{ width: '500px' }}
        breakpoints={{ '960px': '75vw', '641px': '95vw' }}
        modal
        maskClassName="dialog-dark-mask"
      >
        <div className="p-fluid">
          {/* Info de actividad */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Tarea para la actividad:</p>
            <p className="font-semibold text-gray-900">{actividadNombre}</p>
          </div>

          {/* Nombre de la tarea */}
          <div className="field">
            <label htmlFor="nombre" className="font-semibold">
              Nombre de la tarea <span className="text-red-500">*</span>
            </label>
            <InputText
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Preparar material para la actividad"
              autoFocus
            />
          </div>

          {/* Descripción */}
          <div className="field">
            <label htmlFor="descripcion" className="font-semibold">
              Descripción
            </label>
            <InputTextarea
              id="descripcion"
              value={formData.descripcion || ''}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              placeholder="Detalles de la tarea..."
            />
          </div>

          {/* Asignar a */}
          <div className="field">
            <label htmlFor="asignados" className="font-semibold">
              Asignar a <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              id="asignados"
              value={formData.usuarios_asignados_ids || []}
              options={usuariosOptions}
              onChange={(e) => setFormData({ ...formData, usuarios_asignados_ids: e.value })}
              placeholder={loadingUsers ? 'Cargando usuarios...' : 'Selecciona personas'}
              filter
              disabled={loadingUsers}
              emptyFilterMessage="No se encontraron usuarios"
              showClear
              itemTemplate={userItemTemplate}
              selectedItemTemplate={selectedUserTemplate}
              maxSelectedLabels={3}
              display="chip"
            />
            {loadingUsers && (
              <small className="text-gray-500 mt-1 block">
                <i className="pi pi-spin pi-spinner mr-2"></i>
                Cargando usuarios...
              </small>
            )}
          </div>

          {/* Prioridad y Fecha */}
          <div className="formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="prioridad" className="font-semibold">
                Prioridad
              </label>
              <Dropdown
                id="prioridad"
                value={formData.prioridad}
                options={prioridadOptions}
                onChange={(e) => setFormData({ ...formData, prioridad: e.value })}
                placeholder="Selecciona prioridad"
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="fecha_vencimiento" className="font-semibold">
                Vencimiento <span className="text-red-500">*</span>
              </label>
              <Calendar
                id="fecha_vencimiento"
                value={formData.fecha_vencimiento ? new Date(formData.fecha_vencimiento) : null}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_vencimiento: e.value?.toISOString() || '' })
                }
                showTime
                hourFormat="24"
                showIcon
                dateFormat="dd/mm/yy"
                minDate={new Date()}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
