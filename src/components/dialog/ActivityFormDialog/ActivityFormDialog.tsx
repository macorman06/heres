// src/components/dialog/ActivityFormDialog/ActivityFormDialog.tsx

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Actividad, CreateActividadDTO, actividadesService } from '../../../services/api/index';
import './ActivityFormDialog.css';

interface ActivityFormDialogProps {
  visible: boolean;
  actividad?: Actividad | null;
  onHide: () => void;
  onSuccess: () => void;
}

interface FormDataType {
  nombre: string;
  descripcion: string;
  tipo_actividad: string;
  seccion: string;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  es_recurrente: boolean;
  usuario_responsable_id: number;
  animadores_ids: number[];
  participantes_ids: number[];
  visibilidad_roles: string[];
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

  const [formData, setFormData] = useState<FormDataType>({
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

  // ==================== Lifecycle ====================
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
      visibilidad_roles: [],
    });
    setErrors({});
    onHide();
  };

  // ==================== Opciones de Dropdowns ====================
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

  // ==================== Footer del Diálogo ====================
  const footer = (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleCancel}
        className="p-button-secondary"
      />
      <Button
        label={actividad?.id ? 'Actualizar' : 'Crear'}
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
        className="p-button-primary"
      />
    </div>
  );

  // ==================== Render ====================
  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header={actividad?.id ? 'Editar Actividad' : 'Nueva Actividad'}
        footer={footer}
        modal
        className="activity-form-dialog"
        style={{ width: '100%', maxWidth: '800px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* ==================== Nombre ==================== */}
          <div className="form-field">
            <label htmlFor="nombre" className="required">
              Nombre
            </label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? 'p-invalid w-full' : 'w-full'}
              placeholder="Ej: Reunión semanal del CJ"
            />
            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
          </div>

          {/* ==================== Descripción con Editor ==================== */}
          <div className="form-field">
            <label htmlFor="descripcion" className="required">
              Descripción
            </label>
            <Editor
              id="descripcion"
              value={formData.descripcion}
              onTextChange={(e) => setFormData({ ...formData, descripcion: e.htmlValue || '' })}
              style={{ height: '320px' }}
              placeholder="Describe brevemente la actividad..."
            />
          </div>

          {/* ==================== Tipo y Sección (2 columnas) ==================== */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="tipo_actividad" className="required">
                Tipo de Actividad
              </label>
              <Dropdown
                id="tipo_actividad"
                value={formData.tipo_actividad}
                onChange={(e) => setFormData({ ...formData, tipo_actividad: e.value })}
                options={tiposActividad}
                placeholder="Selecciona tipo"
                className={errors.tipo_actividad ? 'p-invalid w-full' : 'w-full'}
              />
              {errors.tipo_actividad && (
                <div className="error-message">{errors.tipo_actividad}</div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="seccion" className="required">
                Sección
              </label>
              <Dropdown
                id="seccion"
                value={formData.seccion}
                onChange={(e) => setFormData({ ...formData, seccion: e.value })}
                options={seccionesOptions}
                placeholder="Selecciona sección"
                className={errors.seccion ? 'p-invalid w-full' : 'w-full'}
              />
              {errors.seccion && <div className="error-message">{errors.seccion}</div>}
            </div>
          </div>

          {/* ==================== Fechas (2 columnas) ==================== */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="fecha_inicio" className="required">
                Fecha de Inicio
              </label>
              <Calendar
                id="fecha_inicio"
                value={formData.fecha_inicio ? new Date(formData.fecha_inicio) : null}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fecha_inicio: e.value?.toISOString() || '',
                  })
                }
                showTime
                hourFormat="24"
                stepMinute={15}
                showIcon
                dateFormat="dd/mm/yy"
                timeOnly={false}
                appendTo={document.body}
                className="calendar-pequeno"
                inputClassName="calendar-input-pequeno"
              />
              {errors.fecha_inicio && <div className="error-message">{errors.fecha_inicio}</div>}
            </div>

            <div className="form-field">
              <label htmlFor="fecha_fin" className="required">
                Fecha de Fin
              </label>
              <Calendar
                id="fecha_fin"
                value={formData.fecha_fin ? new Date(formData.fecha_fin) : null}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fecha_fin: e.value?.toISOString() || '',
                  })
                }
                showTime
                hourFormat="24"
                stepMinute={15}
                showIcon
                dateFormat="dd/mm/yy"
                timeOnly={false}
                appendTo={document.body}
                className="calendar-pequeno"
                inputClassName="calendar-input-pequeno"
              />
              {errors.fecha_fin && <div className="error-message">{errors.fecha_fin}</div>}
            </div>
          </div>

          {/* ==================== Ubicación ==================== */}
          <div className="form-field">
            <label htmlFor="ubicacion" className="required">
              Ubicación
            </label>
            <InputText
              id="ubicacion"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              className={errors.ubicacion ? 'p-invalid w-full' : 'w-full'}
              placeholder="Ej: Sala principal, Online, etc."
            />
            {errors.ubicacion && <div className="error-message">{errors.ubicacion}</div>}
          </div>
        </div>
      </Dialog>
    </>
  );
};
