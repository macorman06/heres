// src/components/tables/PruebasTable/PruebasTable.tsx

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Prueba } from '../../../types/prueba.types';
import './PruebasTable.css';

interface PruebasTableProps {
  pruebas: Prueba[];
  onView: (prueba: Prueba) => void;
  onEdit: (prueba: Prueba) => void;
  onDelete: (prueba: Prueba) => void;
  loading?: boolean;
}

export const PruebasTable: React.FC<PruebasTableProps> = ({
  pruebas,
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  // Template para Nombre (sin truncar)
  const nombreTemplate = (rowData: Prueba) => {
    return (
      <div className="nombre-cell">
        <span className="nombre-text">{rowData.nombre}</span>
      </div>
    );
  };

  // Template para Descripción (truncada con tooltip)
  const descripcionTemplate = (rowData: Prueba) => {
    return (
      <div className="descripcion-cell">
        <span className="descripcion-text" title={rowData.descripcion || 'Sin descripción'}>
          {rowData.descripcion || 'Sin descripción'}
        </span>
      </div>
    );
  };

  // Template para Tipo con Chip
  const tipoTemplate = (rowData: Prueba) => {
    if (!rowData.tipo) return '-';

    const tipoColors: Record<string, { bg: string; text: string }> = {
      Deporte: { bg: '#DBEAFE', text: '#1E40AF' },
      Puntería: { bg: '#FED7AA', text: '#9A3412' },
      'Memoria y Lógica': { bg: '#E9D5FF', text: '#6B21A8' },
      Trivial: { bg: '#BFDBFE', text: '#1E3A8A' },
      'Trivial Cultural': { bg: '#BFDBFE', text: '#1E3A8A' },
      'Trivial Digital': { bg: '#93C5FD', text: '#1E3A8A' },
      'Azar e Inteligencia': { bg: '#E9D5FF', text: '#6B21A8' },
      Creatividad: { bg: '#FDE68A', text: '#92400E' },
      Musical: { bg: '#D1FAE5', text: '#065F46' },
      'Expresión Musical y Creatividad': { bg: '#A7F3D0', text: '#065F46' },
      'Expresión Artística y Creatividad': { bg: '#FCD34D', text: '#92400E' },
      Adivinanzas: { bg: '#FBCFE8', text: '#9F1239' },
      'Adivinanzas y Actuación': { bg: '#F9A8D4', text: '#9F1239' },
      'Cooperación y Habilidad': { bg: '#C7D2FE', text: '#3730A3' },
      'Deporte - Batalla': { bg: '#FCA5A5', text: '#991B1B' },
      'Deporte y Creatividad': { bg: '#BAE6FD', text: '#075985' },
      Formación: { bg: '#FEF3C7', text: '#92400E' },
      'Litúrgico-Musical': { bg: '#BBF7D0', text: '#065F46' },
      Yincana: { bg: '#DDD6FE', text: '#5B21B6' },
    };

    const colors = tipoColors[rowData.tipo] || { bg: '#E5E7EB', text: '#374151' };

    return (
      <div className="chip-container">
        <Chip
          label={rowData.tipo}
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            height: '25px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        />
      </div>
    );
  };

  // Template para Nivel de Dificultad con Chip
  const nivelTemplate = (rowData: Prueba) => {
    if (!rowData.nivel_dificultad) return '-';

    const nivelColors: Record<string, { bg: string; text: string }> = {
      Bajo: { bg: '#D1FAE5', text: '#065F46' },
      Medio: { bg: '#FED7AA', text: '#9A3412' },
      Alto: { bg: '#FECACA', text: '#991B1B' },
    };

    const colors = nivelColors[rowData.nivel_dificultad] || { bg: '#E5E7EB', text: '#374151' };

    return (
      <div className="chip-container">
        <Chip
          label={rowData.nivel_dificultad}
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            height: '25px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        />
      </div>
    );
  };

  // Template para Ubicación (lugar)
  const ubicacionTemplate = (rowData: Prueba) => {
    return <span>{rowData.lugar || '-'}</span>;
  };

  // Template para Duración
  const duracionTemplate = (rowData: Prueba) => {
    if (!rowData.duracion_estimada) return '-';
    return <span>{rowData.duracion_estimada} min</span>;
  };

  // Template para Fecha de Creación
  const fechaTemplate = (rowData: Prueba) => {
    if (!rowData.fecha_creacion) return '-';

    const fecha = new Date(rowData.fecha_creacion);
    return (
      <span>
        {fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </span>
    );
  };

  // Template para Acciones
  const actionsTemplate = (rowData: Prueba) => {
    return (
      <div className="actions-cell">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => onView(rowData)}
          tooltip="Ver detalles"
          tooltipOptions={{ position: 'left' }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="warning"
          onClick={() => onEdit(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: 'left' }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => onDelete(rowData)}
          tooltip="Eliminar"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={pruebas}
      loading={loading}
      emptyMessage="No hay pruebas disponibles"
      className="pruebas-table"
      stripedRows
      sortMode="multiple"
      removableSort
    >
      <Column
        field="nombre"
        header="Nombre"
        body={nombreTemplate}
        sortable
        style={{ width: '200px', minWidth: '200px' }}
      />
      <Column
        field="descripcion"
        header="Descripción"
        body={descripcionTemplate}
        sortable
        style={{ flex: '1', minWidth: '250px' }}
      />
      <Column
        field="tipo"
        header="Tipo"
        body={tipoTemplate}
        sortable
        style={{ width: '160px', minWidth: '160px' }}
      />
      <Column
        field="nivel_dificultad"
        header="Nivel"
        body={nivelTemplate}
        sortable
        style={{ width: '100px', minWidth: '100px' }}
      />
      <Column
        field="lugar"
        header="Ubicación"
        body={ubicacionTemplate}
        sortable
        style={{ width: '140px', minWidth: '140px' }}
      />
      <Column
        field="duracion_estimada"
        header="Duración"
        body={duracionTemplate}
        sortable
        style={{ width: '100px', minWidth: '100px' }}
      />
      <Column
        field="fecha_creacion"
        header="Fecha"
        body={fechaTemplate}
        sortable
        style={{ width: '110px', minWidth: '110px' }}
      />
      <Column
        header="Acciones"
        body={actionsTemplate}
        style={{ width: '150px', minWidth: '150px' }}
      />
    </DataTable>
  );
};
