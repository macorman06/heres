// src/components/cards/GrupodefeCard.tsx

import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Material } from '../../../types/material.types.ts';
import './GrupodefeCard.css';

interface GrupodefeCardProps {
  material: Material;
  onDownload: (material: Material) => void;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

// ============ FUNCIONES HELPER PARA COLORES ============

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

const formatCategoriaText = (categoria: string) => {
  const textos: Record<string, string> = {
    'la-fe-vivida': 'La fe vivida',
    'la-fe-comprometida': 'La fe comprometida',
    'la-fe-compartida': 'La fe compartida',
    'la-fe-comprendida': 'La fe comprendida',
    'el-centro-de-la-fe': 'El centro de la fe',
    'la-fe-celebrada': 'La fe celebrada',
  };
  return textos[categoria] || categoria;
};

const hasIEFTag = (etiquetas?: string[]) => {
  if (!etiquetas) return false;
  return etiquetas.some(
    (tag) =>
      tag.toLowerCase() === 'ief' || tag.toLowerCase().includes('itinerario de educación en la fe')
  );
};

export const GrupodefeCard: React.FC<GrupodefeCardProps> = ({
  material,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const menuRef = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Visualizar',
      icon: 'pi pi-eye',
      command: () => onDownload(material),
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => onEdit(material),
    },
    {
      separator: true,
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      className: 'text-red-500',
      command: () => onDelete(material),
    },
  ];

  const showIEFLogo = hasIEFTag(material.etiquetas);

  return (
    <Card className="grupodefe-card">
      <div className="grupodefe-card-content">
        {/* Header: Título, GRUPO y Logo IEF */}
        <div className="grupodefe-card-header">
          <h3 className="grupodefe-card-title">{material.titulo}</h3>

          {/* Contenedor para chip + logo */}
          <div className="grupodefe-header-badges">
            {material.grupo && (
              <Chip
                label={material.grupo.toUpperCase()}
                className="grupodefe-chip"
                style={{
                  backgroundColor: getGrupoColor(material.grupo).bg,
                  color: getGrupoColor(material.grupo).text,
                }}
              />
            )}

            {/* Logo Salesianos si tiene etiqueta IEF */}
            {showIEFLogo && (
              <img
                src="/logos/logoSalesianosWeb.png"
                alt="IEF"
                className="grupodefe-ief-logo"
                title="Itinerario de Educación en la Fe"
              />
            )}
          </div>
        </div>

        {/* Descripción limitada a 3 líneas */}
        <p className="grupodefe-card-description">{material.descripcion || 'Sin descripción'}</p>

        {/* Footer: Categoría | Fecha | Botón */}
        <div className="grupodefe-card-footer">
          {/* Chip de Categoría (izquierda) */}
          {material.categoria && (
            <Chip
              label={formatCategoriaText(material.categoria)}
              className="grupodefe-chip"
              style={{
                backgroundColor: getCategoriaColor(material.categoria).bg,
                color: getCategoriaColor(material.categoria).text,
              }}
            />
          )}

          {/* Fecha (centro) */}
          <span className="grupodefe-card-date">
            {new Date(material.fecha_subida).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>

          {/* Botón de menú (derecha) */}
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-text p-button-rounded"
            onClick={(e) => menuRef.current?.toggle(e)}
            aria-label="Opciones"
          />
          <Menu model={menuItems} popup ref={menuRef} />
        </div>
      </div>
    </Card>
  );
};
