// src/components/dialog/MaterialEditDialog/MaterialEditDialog.tsx
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';
import { MaterialFormData } from '../../../types/material.types';
import './MaterialEditDialog.css';

interface MaterialEditDialogProps {
  visible: boolean;
  isEditing: boolean; // ✅ Cambiado de isEdit a isEditing
  formData: MaterialFormData;
  onHide: () => void;
  onSubmit: () => void;
  onChange: (field: keyof MaterialFormData, value: any) => void;
}

export const MaterialEditDialog: React.FC<MaterialEditDialogProps> = ({
  visible,
  isEditing, // ✅ Ahora coincide con CentroJuvenilPage
  formData,
  onHide,
  onSubmit,
  onChange,
}) => {
  // Opciones de dropdowns
  const tipoOptions = [
    { label: 'PDF', value: 'PDF' },
    { label: 'DOC', value: 'DOC' },
    { label: 'DOCX', value: 'DOCX' },
    { label: 'XLS', value: 'XLS' },
    { label: 'XLSX', value: 'XLSX' },
    { label: 'PPT', value: 'PPT' },
    { label: 'PPTX', value: 'PPTX' },
    { label: 'IMG', value: 'IMG' },
    { label: 'VIDEO', value: 'VIDEO' },
    { label: 'ZIP', value: 'ZIP' },
    { label: 'OTRO', value: 'OTRO' },
  ];

  const grupoOptions = [
    { label: 'PREAS', value: 'PREAS' },
    { label: 'J1', value: 'J1' },
    { label: 'J2', value: 'J2' },
    { label: 'J3', value: 'J3' },
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'TODOS', value: 'TODOS' },
  ];

  const seccionOptions = [
    { label: 'Centro Juvenil', value: 'CJ' },
    { label: 'Chiqui', value: 'Chiqui' },
  ];

  const categoriaOptions = [
    { label: 'La fe vivida', value: 'la-fe-vivida' },
    { label: 'La fe comprometida', value: 'la-fe-comprometida' },
    { label: 'La fe compartida', value: 'la-fe-compartida' },
    { label: 'La fe comprendida', value: 'la-fe-comprendida' },
    { label: 'El centro de la fe', value: 'el-centro-de-la-fe' },
    { label: 'La fe celebrada', value: 'la-fe-celebrada' },
  ];

  const dialogFooter = (
    <div className="flex gap-2 justify-content-end align-items-center flex-row-reverse">
      <Button
        label={isEditing ? 'Actualizar' : 'Subir'}
        icon={isEditing ? 'pi pi-check' : 'pi pi-upload'}
        onClick={onSubmit}
        disabled={!formData.titulo || (!isEditing && !formData.file)}
        className="p-button-primary"
      />
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="btn-secondary" />
    </div>
  );

  // Header personalizado con icono y título
  const dialogHeader = (
    <div className="dialog-header-custom">
      <i className={isEditing ? 'pi pi-pencil' : 'pi pi-upload'} />
      <span>{isEditing ? 'Editar Material' : 'Subir Nuevo Material'}</span>
    </div>
  );

  return (
    <Dialog
      header={dialogHeader}
      visible={visible}
      className="material-edit-dialog"
      maskClassName="dialog-dark-mask"
      style={{ width: '650px' }}
      onHide={onHide}
      footer={dialogFooter}
      draggable={false}
      resizable={false}
    >
      <div className="dialog-content">
        {/* Sección: Información Básica */}
        <div className="form-section">
          <h3 className="section-title">Información Básica</h3>

          {/* Título */}
          <div className="form-field">
            <label htmlFor="titulo">
              Título <span className="required">*</span>
            </label>
            <InputText
              id="titulo"
              value={formData.titulo || ''}
              onChange={(e) => onChange('titulo', e.target.value)}
              placeholder="Nombre del material"
              className="w-full"
            />
          </div>

          {/* Descripción */}
          <div className="form-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputTextarea
              id="descripcion"
              value={formData.descripcion || ''}
              onChange={(e) => onChange('descripcion', e.target.value)}
              placeholder="Breve descripción del material"
              className="w-full"
              rows={3}
            />
          </div>
        </div>

        {/* Sección: Archivo (solo para upload) */}
        {!isEditing && (
          <div className="form-section">
            <h3 className="section-title">Archivo</h3>

            <div className="form-field">
              <label htmlFor="file">
                Seleccionar archivo <span className="required">*</span>
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onChange('file', e.target.files[0]);
                  }
                }}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                className="file-input"
              />
              <small className="form-help-text">
                Máximo 50 MB. Formatos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, IMG, ZIP
              </small>
              {formData.file && (
                <div className="file-selected">
                  <i className="pi pi-file" />
                  <span>{formData.file.name}</span>
                  <span className="file-size">
                    ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección: Clasificación */}
        <div className="form-section">
          <h3 className="section-title">Clasificación</h3>

          <div className="form-grid-2">
            {/* Tipo */}
            <div className="form-field">
              <label htmlFor="tipo">Tipo de Archivo</label>
              <Dropdown
                id="tipo"
                value={formData.tipo || 'PDF'}
                options={tipoOptions}
                onChange={(e) => onChange('tipo', e.value)}
                placeholder="Selecciona tipo"
                className="w-full"
              />
            </div>

            {/* Grupo */}
            <div className="form-field">
              <label htmlFor="grupo">Grupo</label>
              <Dropdown
                id="grupo"
                value={formData.grupo || ''}
                options={grupoOptions}
                onChange={(e) => onChange('grupo', e.value)}
                placeholder="Selecciona grupo"
                className="w-full"
              />
            </div>

            {/* Sección */}
            <div className="form-field">
              <label htmlFor="seccion">Sección</label>
              <Dropdown
                id="seccion"
                value={formData.seccion || 'CJ'}
                options={seccionOptions}
                onChange={(e) => onChange('seccion', e.value)}
                placeholder="Selecciona sección"
                className="w-full"
              />
            </div>

            {/* Categoría */}
            <div className="form-field">
              <label htmlFor="categoria">Categoría</label>
              <Dropdown
                id="categoria"
                value={formData.categoria || 'formación'}
                options={categoriaOptions}
                onChange={(e) => onChange('categoria', e.value)}
                placeholder="Selecciona categoría"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Sección: Etiquetas */}
        <div className="form-section">
          <h3 className="section-title">Etiquetas</h3>

          <div className="form-field">
            <label htmlFor="etiquetas">Etiquetas</label>
            <Chips
              id="etiquetas"
              value={formData.etiquetas || []}
              onChange={(e) => onChange('etiquetas', e.value)}
              separator=","
              placeholder="Ej: Presentación, Dinámica, Catequesis..."
              className="w-full"
            />
            <small className="form-help-text">
              Presiona Enter después de cada etiqueta o separa con comas
            </small>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
