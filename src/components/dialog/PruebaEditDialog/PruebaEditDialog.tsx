// src/components/dialog/PruebaEditDialog/PruebaEditDialog.tsx

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';
import { PruebaFormData } from '../../../types/prueba.types';
import './PruebaEditDialog.css';

interface PruebaEditDialogProps {
  visible: boolean;
  isEditing: boolean;
  formData: PruebaFormData;
  onHide: () => void;
  onSubmit: () => void;
  onChange: (field: keyof PruebaFormData, value: any) => void;
}

export const PruebaEditDialog: React.FC<PruebaEditDialogProps> = ({
  visible,
  isEditing,
  formData,
  onHide,
  onSubmit,
  onChange,
}) => {
  // Opciones de dropdowns
  const tipoOptions = [
    { label: 'Deporte', value: 'Deporte' },
    { label: 'Puntería', value: 'Puntería' },
    { label: 'Memoria y Lógica', value: 'Memoria y Lógica' },
    { label: 'Trivial', value: 'Trivial' },
    { label: 'Trivial Cultural', value: 'Trivial Cultural' },
    { label: 'Trivial Digital', value: 'Trivial Digital' },
    { label: 'Azar e Inteligencia', value: 'Azar e Inteligencia' },
    { label: 'Creatividad', value: 'Creatividad' },
    { label: 'Musical', value: 'Musical' },
    { label: 'Expresión Musical y Creatividad', value: 'Expresión Musical y Creatividad' },
    { label: 'Expresión Artística y Creatividad', value: 'Expresión Artística y Creatividad' },
    { label: 'Adivinanzas', value: 'Adivinanzas' },
    { label: 'Adivinanzas y Actuación', value: 'Adivinanzas y Actuación' },
    { label: 'Cooperación y Habilidad', value: 'Cooperación y Habilidad' },
    { label: 'Deporte - Batalla', value: 'Deporte - Batalla' },
    { label: 'Deporte y Creatividad', value: 'Deporte y Creatividad' },
    { label: 'Formación', value: 'Formación' },
    { label: 'Litúrgico-Musical', value: 'Litúrgico-Musical' },
    { label: 'Yincana', value: 'Yincana' },
  ];

  const nivelOptions = [
    { label: 'Bajo', value: 'Bajo' },
    { label: 'Medio', value: 'Medio' },
    { label: 'Alto', value: 'Alto' },
  ];

  const lugarOptions = [
    { label: 'Interior', value: 'Interior' },
    { label: 'Exterior', value: 'Exterior' },
    { label: 'Ambos', value: 'Ambos' },
  ];

  const dialogFooter = (
    <div className="dialog-footer">
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button
        label={isEditing ? 'Actualizar' : 'Crear Prueba'}
        icon={isEditing ? 'pi pi-check' : 'pi pi-plus'}
        onClick={onSubmit}
        autoFocus
        className="btn-primary"
      />
    </div>
  );

  // Header personalizado con icono y título
  const dialogHeader = (
    <div className="dialog-header">
      <i className="pi pi-gamepad" style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}></i>
      <span>{isEditing ? 'Editar Prueba' : 'Crear Nueva Prueba'}</span>
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={dialogHeader}
      footer={dialogFooter}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '95vw' }}
      className="prueba-edit-dialog"
      modal
    >
      <div className="dialog-content">
        {/* Sección: Información Básica */}
        <div className="section">
          <h3 className="section-title">Información Básica</h3>

          {/* Nombre */}
          <div className="field">
            <label htmlFor="nombre">Nombre *</label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => onChange('nombre', e.target.value)}
              placeholder="Nombre de la prueba o juego"
              className="w-full"
            />
          </div>

          {/* Descripción */}
          <div className="field">
            <label htmlFor="descripcion">Descripción *</label>
            <InputTextarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => onChange('descripcion', e.target.value)}
              placeholder="Breve descripción de la prueba"
              className="w-full"
              rows={3}
            />
          </div>

          {/* Lugar */}
          <div className="field">
            <label htmlFor="lugar">Lugar</label>
            <Dropdown
              id="lugar"
              value={formData.lugar}
              options={lugarOptions}
              onChange={(e) => onChange('lugar', e.value)}
              placeholder="Selecciona el lugar"
              className="w-full"
              showClear
              editable
            />
          </div>
        </div>

        {/* Sección: Clasificación */}
        <div className="section">
          <h3 className="section-title">Clasificación</h3>

          <div className="field-group">
            {/* Tipo */}
            <div className="field">
              <label htmlFor="tipo">Tipo</label>
              <Dropdown
                id="tipo"
                value={formData.tipo}
                options={tipoOptions}
                onChange={(e) => onChange('tipo', e.value)}
                placeholder="Selecciona tipo"
                className="w-full"
                showClear
                filter
              />
            </div>

            {/* Nivel de Dificultad */}
            <div className="field">
              <label htmlFor="nivel">Nivel de Dificultad</label>
              <Dropdown
                id="nivel"
                value={formData.nivel_dificultad}
                options={nivelOptions}
                onChange={(e) => onChange('nivel_dificultad', e.value)}
                placeholder="Selecciona nivel"
                className="w-full"
                showClear
              />
            </div>
          </div>

          <div className="field-group">
            {/* Edad Mínima */}
            <div className="field">
              <label htmlFor="edadMin">Edad Mínima</label>
              <InputNumber
                id="edadMin"
                value={formData.edad_recomendada_min}
                onValueChange={(e) => onChange('edad_recomendada_min', e.value)}
                placeholder="Ej: 10"
                className="w-full"
                min={0}
                max={99}
                showButtons
              />
            </div>

            {/* Edad Máxima */}
            <div className="field">
              <label htmlFor="edadMax">Edad Máxima</label>
              <InputNumber
                id="edadMax"
                value={formData.edad_recomendada_max}
                onValueChange={(e) => onChange('edad_recomendada_max', e.value)}
                placeholder="Ej: 16"
                className="w-full"
                min={0}
                max={99}
                showButtons
              />
            </div>

            {/* Duración Estimada */}
            <div className="field">
              <label htmlFor="duracion">Duración (minutos)</label>
              <InputNumber
                id="duracion"
                value={formData.duracion_estimada}
                onValueChange={(e) => onChange('duracion_estimada', e.value)}
                placeholder="Ej: 30"
                className="w-full"
                min={0}
                suffix=" min"
                showButtons
              />
            </div>
          </div>
        </div>

        {/* Sección: Materiales Necesarios */}
        <div className="section">
          <h3 className="section-title">Materiales Necesarios</h3>

          <div className="field">
            <label htmlFor="materiales">Materiales</label>
            <Chips
              id="materiales"
              value={formData.materiales_necesarios}
              onChange={(e) => onChange('materiales_necesarios', e.value)}
              separator=","
              placeholder="Ej: Conos, Pelotas, Silbato..."
              className="w-full"
            />
            <small className="field-hint">
              Presiona Enter después de cada material o separa con comas
            </small>
          </div>
        </div>

        {/* Sección: Objetivos Pedagógicos */}
        <div className="section">
          <h3 className="section-title">Objetivos Pedagógicos</h3>

          <div className="field">
            <label htmlFor="objetivos">Objetivos</label>
            <Chips
              id="objetivos"
              value={formData.objetivos_pedagogicos}
              onChange={(e) => onChange('objetivos_pedagogicos', e.value)}
              separator=","
              placeholder="Ej: Fomentar trabajo en equipo, Desarrollar coordinación..."
              className="w-full"
            />
            <small className="field-hint">
              Presiona Enter después de cada objetivo o separa con comas
            </small>
          </div>
        </div>

        {/* Sección: Desarrollo */}
        <div className="section">
          <h3 className="section-title">Desarrollo</h3>

          <div className="field">
            <label htmlFor="desarrollo">Descripción del Desarrollo</label>
            <InputTextarea
              id="desarrollo"
              value={formData.desarrollo}
              onChange={(e) => onChange('desarrollo', e.target.value)}
              placeholder="Describe paso a paso cómo se desarrolla la prueba..."
              className="w-full"
              rows={5}
            />
          </div>
        </div>

        {/* Sección: Criterios de Evaluación */}
        <div className="section">
          <h3 className="section-title">Criterios de Evaluación</h3>

          <div className="field">
            <label htmlFor="criterios">Criterios</label>
            <Chips
              id="criterios"
              value={formData.criterios_evaluacion}
              onChange={(e) => onChange('criterios_evaluacion', e.value)}
              separator=","
              placeholder="Ej: Velocidad, Trabajo en equipo, Creatividad..."
              className="w-full"
            />
            <small className="field-hint">
              Presiona Enter después de cada criterio o separa con comas
            </small>
          </div>
        </div>

        {/* Sección: Variantes y Observaciones */}
        <div className="section">
          <h3 className="section-title">Variantes y Observaciones</h3>

          {/* Variantes */}
          <div className="field">
            <label htmlFor="variantes">Variantes</label>
            <InputTextarea
              id="variantes"
              value={formData.variantes}
              onChange={(e) => onChange('variantes', e.target.value)}
              placeholder="Describe posibles variantes de la prueba..."
              className="w-full"
              rows={3}
            />
          </div>

          {/* Observaciones */}
          <div className="field">
            <label htmlFor="observaciones">Observaciones</label>
            <InputTextarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => onChange('observaciones', e.target.value)}
              placeholder="Añade observaciones importantes, precauciones, recomendaciones..."
              className="w-full"
              rows={3}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
