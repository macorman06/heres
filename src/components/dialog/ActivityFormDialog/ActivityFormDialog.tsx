// src/components/dialog/ActivityFormDialog/ActivityFormDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Actividad, CreateActividadDTO, actividadesService } from '../../../services/api/index';

interface ActivityFormDialogProps {
  visible: boolean;
  actividad?: Actividad | null;
  onHide: () => void;
  onSuccess: () => void;
}

export const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  visible,
  actividad,
  onHide,
  onSuccess,
}) => {
  const toast = React.useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtener usuario actual del localStorage
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  const [formData, setFormData] = useState<Partial<CreateActividadDTO>>({
    nombre: '',
    descripcion: '',
    tipo_actividad: 'Actividad normal',
    seccion: 'CJ',
    fecha_inicio: new Date().toISOString(),
    fecha_fin: new Date().toISOString(),
    ubicacion: '',
    es_recurrente: false,
    usuario_responsable_id: currentUserId,
    animadores_ids: [],
    participantes_ids: [],
    visibilidad_roles: [],
  });

  // Resetear o cargar datos cuando el diálogo se abre/cierra
  useEffect(() => {
    if (visible) {
      if (actividad) {
        // Modo edición: cargar datos de la actividad
        setFormData({
          nombre: actividad.nombre,
          descripcion: actividad.descripcion || '',
          tipo_actividad: actividad.tipo_actividad,
          seccion: actividad.seccion,
          fecha_inicio: actividad.fecha_inicio,
          fecha_fin: actividad.fecha_fin,
          ubicacion: actividad.ubicacion,
          es_recurrente: actividad.es_recurrente,
          usuario_responsable_id: actividad.usuario_responsable_id,
          animadores_ids: actividad.animadores_ids || [],
          participantes_ids: actividad.participantes_ids || [],
          visibilidad_roles: actividad.visibilidad_roles || [],
        });
      } else {
        // Modo creación: datos por defecto
        setFormData({
          nombre: '',
          descripcion: '',
          tipo_actividad: 'Actividad normal',
          seccion: 'CJ',
          fecha_inicio: new Date().toISOString(),
          fecha_fin: new Date().toISOString(),
          ubicacion: '',
          es_recurrente: false,
          usuario_responsable_id: currentUserId,
          animadores_ids: [],
          participantes_ids: [],
          visibilidad_roles: [],
        });
      }
      setErrors({});
    }
  }, [visible, actividad, currentUserId]);

  // ==================== Validación ====================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.tipo_actividad) {
      newErrors.tipo_actividad = 'El tipo de actividad es obligatorio';
    }

    if (!formData.seccion) {
      newErrors.seccion = 'La sección es obligatoria';
    }

    if (!formData.ubicacion?.trim()) {
      newErrors.ubicacion = 'La ubicación es obligatoria';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es obligatoria';
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);
      if (fin < inicio) {
        newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== Handlers ====================
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, completa todos los campos obligatorios',
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      if (actividad?.id) {
        // Actualizar actividad existente
        await actividadesService.actualizar(actividad.id, formData as Partial<CreateActividadDTO>);
        toast.current?.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Actividad actualizada correctamente',
          life: 3000,
        });
      } else {
        // Crear nueva actividad
        await actividadesService.crear(formData as CreateActividadDTO);
        toast.current?.show({
          severity: 'success',
          summary: 'Creado',
          detail: 'Actividad creada correctamente',
          life: 3000,
        });
      }
      onSuccess();
      onHide();
    } catch (error: any) {
      console.error('Error guardando actividad:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.error || 'Error al guardar la actividad',
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tipo_actividad: 'Actividad normal',
      seccion: 'CJ',
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date().toISOString(),
      ubicacion: '',
      es_recurrente: false,
      usuario_responsable_id: currentUserId,
      animadores_ids: [],
      participantes_ids: [],
    });
    setErrors({});
    onHide();
  };

  // ==================== Opciones de dropdowns ====================
  const tiposActividad = [
    { label: 'Programación', value: 'Programación' },
    { label: 'Oración', value: 'Oración' },
    { label: 'Comisión', value: 'Comisión' },
    { label: 'Actividad normal', value: 'Actividad normal' },
    { label: 'Reunión', value: 'Reunión' },
    { label: 'Formación', value: 'Formación' },
  ];

  const seccionesOptions = [
    { label: 'CJ', value: 'CJ' },
    { label: 'Chiqui', value: 'Chiqui' },
    { label: 'Ambas', value: 'Ambas' },
  ];

  // ==================== Footer del diálogo ====================
  const footer = (
    <div className="flex gap-2 justify-content-end align-items-center flex-row-reverse">
      <Button
        label={actividad ? 'Actualizar' : 'Crear'}
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
        autoFocus
        className="btn-primary"
      />
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleCancel}
        className="btn-secondary"
        disabled={loading}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={handleCancel}
        header={actividad ? 'Editar Actividad' : 'Nueva Actividad'}
        footer={footer}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '95vw' }}
        modal
        maskClassName="dialog-dark-mask"
      >
        <div className="p-fluid">
          {/* Nombre */}
          <div className="field">
            <label htmlFor="nombre" className="font-semibold">
              Nombre <span className="text-red-500">*</span>
            </label>
            <InputText
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? 'p-invalid' : ''}
              placeholder="Ej: Reunión semanal del CJ"
            />
            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
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
              placeholder="Describe brevemente la actividad..."
            />
          </div>

          {/* Tipo y Sección en la misma fila */}
          <div className="formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="tipo" className="font-semibold">
                Tipo de Actividad <span className="text-red-500">*</span>
              </label>
              <Dropdown
                id="tipo"
                value={formData.tipo_actividad}
                options={tiposActividad}
                onChange={(e) => setFormData({ ...formData, tipo_actividad: e.value })}
                placeholder="Selecciona tipo"
                className={errors.tipo_actividad ? 'p-invalid' : ''}
              />
              {errors.tipo_actividad && <small className="p-error">{errors.tipo_actividad}</small>}
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="seccion" className="font-semibold">
                Sección <span className="text-red-500">*</span>
              </label>
              <Dropdown
                id="seccion"
                value={formData.seccion}
                options={seccionesOptions}
                onChange={(e) => setFormData({ ...formData, seccion: e.value })}
                placeholder="Selecciona sección"
                className={errors.seccion ? 'p-invalid' : ''}
              />
              {errors.seccion && <small className="p-error">{errors.seccion}</small>}
            </div>
          </div>

          {/* Fechas en la misma fila */}
          <div className="formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="fecha_inicio" className="font-semibold">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <Calendar
                id="fecha_inicio"
                value={formData.fecha_inicio ? new Date(formData.fecha_inicio) : null}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.value?.toISOString() || '' })
                }
                showTime
                hourFormat="24"
                showIcon
                dateFormat="dd/mm/yy"
                className={errors.fecha_inicio ? 'p-invalid' : ''}
              />
              {errors.fecha_inicio && <small className="p-error">{errors.fecha_inicio}</small>}
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="fecha_fin" className="font-semibold">
                Fecha de Fin <span className="text-red-500">*</span>
              </label>
              <Calendar
                id="fecha_fin"
                value={formData.fecha_fin ? new Date(formData.fecha_fin) : null}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin: e.value?.toISOString() || '' })
                }
                showTime
                hourFormat="24"
                showIcon
                dateFormat="dd/mm/yy"
                className={errors.fecha_fin ? 'p-invalid' : ''}
              />
              {errors.fecha_fin && <small className="p-error">{errors.fecha_fin}</small>}
            </div>
          </div>

          {/* Ubicación */}
          <div className="field">
            <label htmlFor="ubicacion" className="font-semibold">
              Ubicación <span className="text-red-500">*</span>
            </label>
            <InputText
              id="ubicacion"
              value={formData.ubicacion || ''}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              className={errors.ubicacion ? 'p-invalid' : ''}
              placeholder="Ej: Sala principal, Online, etc."
            />
            {errors.ubicacion && <small className="p-error">{errors.ubicacion}</small>}
          </div>
        </div>
      </Dialog>
    </>
  );
};
