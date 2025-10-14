// src/components/tables/MaterialsTable/MaterialsTable.tsx

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Material } from '../../../types/material.types';
import './MaterialsTable.css';

interface MaterialsTableProps {
  materials: Material[];
  onDownload: (material: Material) => void;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  onDownload,
  onEdit,
  onDelete,
}) => {
  // Función para formatear nombre de categoría
  const formatCategoria = (categoria: string): string => {
    return categoria
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Funciones para colores de chips
  const getGrupoColor = (grupo: string) => {
    const colores: Record<string, { bg: string; text: string }> = {
      J1: { bg: '#DBEAFE', text: '#1E40AF' },
      J2: { bg: '#BFDBFE', text: '#1E3A8A' },
      J3: { bg: '#93C5FD', text: '#1E3A8A' },
      A1: { bg: '#D1FAE5', text: '#065F46' },
      A2: { bg: '#6EE7B7', text: '#065F46' },
      A3: { bg: '#34D399', text: '#065F46' },
      G1: { bg: '#FDE68A', text: '#92400E' },
      G2: { bg: '#FCD34D', text: '#92400E' },
      G3: { bg: '#FBBF24', text: '#78350F' },
      PREAS: { bg: '#FED7AA', text: '#9A3412' },
    };
    return colores[grupo?.toUpperCase()] || { bg: '#E5E7EB', text: '#374151' };
  };

  const getCategoriaColor = (categoria: string) => {
    const colores: Record<string, { bg: string; text: string }> = {
      'la-fe-vivida': { bg: '#F5B8C0', text: '#8B2332' },
      'la-fe-comprometida': { bg: '#EF4444', text: '#FFFFFF' },
      'la-fe-compartida': { bg: '#BE185D', text: '#FFFFFF' },
      'la-fe-comprendida': { bg: '#F97316', text: '#FFFFFF' },
      'el-centro-de-la-fe': { bg: '#9333EA', text: '#FFFFFF' },
      'la-fe-celebrada': { bg: '#6B21A8', text: '#FFFFFF' },
    };
    return colores[categoria] || { bg: '#6B7280', text: '#FFFFFF' };
  };

  // Templates de columnas
  const titleTemplate = (rowData: Material) => <div className="title-cell">{rowData.titulo}</div>;

  const descriptionTemplate = (rowData: Material) => (
    <div className="description-cell">{rowData.descripcion || '-'}</div>
  );

  const grupoTemplate = (rowData: Material) => {
    if (!rowData.grupo) return '-';
    const colores = getGrupoColor(rowData.grupo);
    return (
      <Chip
        label={rowData.grupo}
        className="chip-grupo"
        style={{
          backgroundColor: colores.bg,
          color: colores.text,
        }}
      />
    );
  };

  const categoriaTemplate = (rowData: Material) => {
    if (!rowData.categoria) return '-';
    const colores = getCategoriaColor(rowData.categoria);
    const categoriaFormateada = formatCategoria(rowData.categoria);
    return (
      <Chip
        label={categoriaFormateada}
        className="chip-categoria"
        style={{
          backgroundColor: colores.bg,
          color: colores.text,
        }}
      />
    );
  };

  const dateTemplate = (rowData: Material) => (
    <div className="date-cell">
      {new Date(rowData.fecha_subida).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })}
    </div>
  );

  const actionsTemplate = (rowData: Material) => (
    <div className="table-actions-compact">
      <Button
        icon="pi pi-eye"
        rounded
        text
        onClick={() => onDownload(rowData)}
        tooltip="Visualizar"
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        icon="pi pi-pencil"
        rounded
        text
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

  return (
    <DataTable
      value={materials}
      className="materials-table"
      stripedRows
      showGridlines
      responsiveLayout="scroll"
      emptyMessage="No se encontraron materiales"
    >
      <Column
        field="titulo"
        header="Título"
        sortable
        style={{ minWidth: '200px', maxWidth: '300px' }}
        body={titleTemplate}
      />
      <Column
        field="descripcion"
        header="Descripción"
        sortable
        style={{ minWidth: '300px', maxWidth: '400px' }}
        body={descriptionTemplate}
      />
      <Column
        field="grupo"
        header="Grupo"
        sortable
        style={{ width: '120px' }}
        body={grupoTemplate}
      />
      <Column
        field="categoria"
        header="Categoría"
        sortable
        style={{ width: '150px' }}
        body={categoriaTemplate}
      />
      <Column
        field="fecha_subida"
        header="Fecha"
        sortable
        style={{ width: '110px' }}
        body={dateTemplate}
      />
      <Column header="Acciones" style={{ width: '130px' }} body={actionsTemplate} />
    </DataTable>
  );
};
