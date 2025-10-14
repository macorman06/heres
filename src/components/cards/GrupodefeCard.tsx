// src/components/cards/GrupodefeCard.tsx
import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Material } from '../../types/material.types';

interface GrupodefeCardProps {
  material: Material;
  onDownload: (material: Material) => void;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

export const GrupodefeCard: React.FC<GrupodefeCardProps> = ({
  material,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const menuRef = useRef<Menu>(null);

  // Opciones del menú
  const menuItems: MenuItem[] = [
    {
      label: 'Descargar',
      icon: 'pi pi-download',
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

  return (
    <Card className="material-card">
      {/* Header: Título y Tipo */}
      <div className="card-header-simple">
        <h3 className="card-title">{material.titulo}</h3>
        <Tag value={material.tipo} severity="info" className="card-type-tag" />
      </div>

      {/* Descripción */}
      <p className="card-description">{material.descripcion || 'Sin descripción'}</p>

      {/* Footer: Metadata y Menú */}
      <div className="card-footer-simple">
        <div className="card-metadata-simple">
          {material.grupo && (
            <Chip label={material.grupo} className="metadata-chip" icon="pi pi-users" />
          )}
          <span className="metadata-date">
            <i className="pi pi-calendar"></i>
            {new Date(material.fecha_subida).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Menú de acciones */}
        <div className="card-actions-menu">
          <Menu model={menuItems} popup ref={menuRef} />
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-text p-button-rounded"
            onClick={(e) => menuRef.current?.toggle(e)}
            aria-label="Opciones"
          />
        </div>
      </div>
    </Card>
  );
};
