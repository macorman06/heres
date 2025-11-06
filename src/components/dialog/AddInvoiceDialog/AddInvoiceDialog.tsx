// src/components/dialog/AddInvoiceDialog/AddInvoiceDialog.tsx

import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import './AddInvoiceDialog.css';

interface AddInvoiceDialogProps {
  visible: boolean;
  actividadId: number;
  actividadNombre: string;
  onHide: () => void;
  onSuccess: () => void;
}

interface FormDataType {
  lugar: string;
  tienda: string;
  fecha_compra: string;
  importe: number | null;
  tipo: string;
  foto_ticket: File | null;
}

export const AddInvoiceDialog: React.FC<AddInvoiceDialogProps> = ({
  visible,
  actividadId,
  actividadNombre,
  onHide,
  onSuccess,
}) => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormDataType>({
    lugar: '',
    tienda: '',
    fecha_compra: new Date().toISOString(),
    importe: null,
    tipo: 'Otros',
    foto_ticket: null,
  });

  // ==================== Opciones de tipos ====================
  const tiposFactura = [
    { label: 'Materiales', value: 'Materiales' },
    { label: 'Comida', value: 'Comida' },
    { label: 'Otros', value: 'Otros' },
  ];

  // ==================== Validación ====================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lugar?.trim()) {
      newErrors.lugar = 'El lugar es obligatorio';
    }

    if (!formData.tienda?.trim()) {
      newErrors.tienda = 'La tienda es obligatoria';
    }

    if (!formData.fecha_compra) {
      newErrors.fecha_compra = 'La fecha de compra es obligatoria';
    }

    if (formData.importe === null || formData.importe <= 0) {
      newErrors.importe = 'El importe debe ser mayor a 0';
    }

    if (!formData.foto_ticket) {
      newErrors.foto_ticket = 'La foto del ticket es obligatoria';
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
      // TODO: Implementar llamada al backend cuando esté disponible
      console.log('Datos de factura:', {
        actividadId,
        ...formData,
      });

      toast.current?.show({
        severity: 'success',
        summary: 'Factura añadida',
        detail: 'La factura se ha añadido correctamente',
        life: 3000,
      });

      // Resetear formulario
      setFormData({
        lugar: '',
        tienda: '',
        fecha_compra: new Date().toISOString(),
        importe: null,
        tipo: 'Otros',
        foto_ticket: null,
      });

      onSuccess();
      onHide();
    } catch (error: any) {
      console.error('Error añadiendo factura:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.error || 'Error al añadir la factura',
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      lugar: '',
      tienda: '',
      fecha_compra: new Date().toISOString(),
      importe: null,
      tipo: 'Otros',
      foto_ticket: null,
    });
    setErrors({});
    onHide();
  };

  const handleFileSelect = (e: any) => {
    const file = e.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.current?.show({
          severity: 'error',
          summary: 'Formato inválido',
          detail: 'Por favor, selecciona una imagen',
          life: 3000,
        });
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.current?.show({
          severity: 'error',
          summary: 'Archivo muy grande',
          detail: 'La imagen no debe superar 5MB',
          life: 3000,
        });
        return;
      }

      setFormData({ ...formData, foto_ticket: file });
      toast.current?.show({
        severity: 'info',
        summary: 'Archivo seleccionado',
        detail: `${file.name} cargado correctamente`,
        life: 2000,
      });
    }
  };

  // ==================== Footer ====================
  const footer = (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleCancel}
        className="p-button-secondary"
      />
      <Button
        label="Añadir Factura"
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
        header="Añadir Factura"
        footer={footer}
        modal
        className="invoice-form-dialog"
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Información de actividad */}
          <div className="invoice-activity-info">
            <p className="invoice-activity-label">Factura para la actividad:</p>
            <p className="invoice-activity-name">{actividadNombre}</p>
          </div>

          {/* ==================== Tienda ====================*/}
          <div className="form-field">
            <label htmlFor="tienda" className="required">
              Tienda
            </label>
            <InputText
              id="tienda"
              value={formData.tienda}
              onChange={(e) => setFormData({ ...formData, tienda: e.target.value })}
              className={errors.tienda ? 'p-invalid w-full' : 'w-full'}
              placeholder="Ej: Carrefour, Mercadona, Juguetería..."
            />
            {errors.tienda && <div className="error-message">{errors.tienda}</div>}
          </div>

          {/* ==================== Fecha y Tipo (2 columnas) ====================*/}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="fecha_compra" className="required">
                Fecha de Compra
              </label>
              <Calendar
                id="fecha_compra"
                value={formData.fecha_compra ? new Date(formData.fecha_compra) : null}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fecha_compra: e.value?.toISOString() || '',
                  })
                }
                showIcon
                dateFormat="dd/mm/yy"
                className={errors.fecha_compra ? 'p-invalid w-full' : 'w-full'}
              />
              {errors.fecha_compra && <div className="error-message">{errors.fecha_compra}</div>}
            </div>

            <div className="form-field">
              <label htmlFor="tipo" className="required">
                Tipo
              </label>
              <Dropdown
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.value })}
                options={tiposFactura}
                placeholder="Selecciona tipo"
                className="w-full"
              />
            </div>
          </div>

          {/* ==================== Importe ====================*/}
          <div className="form-field">
            <label htmlFor="importe" className="required">
              Importe (€)
            </label>
            <InputNumber
              id="importe"
              value={formData.importe ?? undefined}
              onValueChange={(e) => setFormData({ ...formData, importe: e.value ?? null })}
              mode="currency"
              currency="EUR"
              locale="es-ES"
              className={errors.importe ? 'p-invalid w-full' : 'w-full'}
              placeholder="0,00"
              min={0}
            />
            {errors.importe && <div className="error-message">{errors.importe}</div>}
          </div>

          {/* ==================== Foto del Ticket ====================*/}
          <div className="form-field">
            <label htmlFor="foto_ticket" className="required">
              Foto del Ticket
            </label>
            <div className="invoice-upload-container">
              <FileUpload
                name="foto_ticket"
                onSelect={handleFileSelect}
                accept="image/*"
                maxFileSize={5000000}
                auto={false}
                chooseLabel="Seleccionar Imagen"
                cancelLabel="Cancelar"
                className="invoice-file-upload"
              />
              {formData.foto_ticket && (
                <div className="invoice-file-info">
                  <p className="invoice-file-name">✓ {formData.foto_ticket.name}</p>
                </div>
              )}
            </div>
            {errors.foto_ticket && <div className="error-message">{errors.foto_ticket}</div>}
          </div>
        </div>
      </Dialog>
    </>
  );
};
