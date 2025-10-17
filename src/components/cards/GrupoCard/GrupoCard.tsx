// src/components/cards/GrupoCard/GrupoCard.tsx

import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { UserAvatar } from '../../common/UserAvatar';
import { GrupoUser } from '../../../types/group.types';
import './GrupoCard.css';

export interface GrupoCardProps {
  id: number;
  nombre: string;
  centro_juvenil: string;
  seccion: string;
  usuarios: GrupoUser[];
  responsables: number[];
  onEdit: () => void;
  onEditMembers: () => void;
  onToggleResponsable: (userId: number) => void;
  onRemoveMember: (userId: number) => void; // ✅ AÑADIR
  onDelete: () => void;
}

export const GrupoCard: React.FC<GrupoCardProps> = ({
  nombre,
  centro_juvenil,
  seccion,
  usuarios,
  responsables = [],
  onEdit,
  onEditMembers,
  onToggleResponsable,
  onRemoveMember, // ✅ AÑADIR
  onDelete,
}) => {
  const menuRef = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Editar grupo',
      icon: 'pi pi-pencil',
      command: onEdit,
    },
    {
      label: 'Gestionar miembros',
      icon: 'pi pi-users',
      command: onEditMembers,
    },
    {
      separator: true,
    },
    {
      label: 'Eliminar grupo',
      icon: 'pi pi-trash',
      command: onDelete,
      className: 'text-red-500',
    },
  ];

  const responsablesArray = Array.isArray(responsables) ? responsables : [];
  const isResponsable = (userId: number) => responsablesArray.includes(userId);
  const canBeResponsable = (user: GrupoUser) => user.rol_id <= 4;

  const animadores = usuarios.filter((u) => u.rol_id <= 4);
  const miembros = usuarios.filter((u) => u.rol_id > 4);

  const header = (
    <div className="grupo-card-header">
      <div className="grupo-title-section">
        <h3 className="grupo-title">{nombre}</h3>
      </div>
      <Button
        icon="pi pi-ellipsis-v"
        rounded
        text
        onClick={(e) => menuRef.current?.toggle(e)}
        className="grupo-menu-button"
      />
      <Menu ref={menuRef} model={menuItems} popup />
    </div>
  );

  const footer = (
    <div className="grupo-card-footer">
      <Chip label={centro_juvenil} className="grupo-centro-chip" />
      <Chip label={seccion} className="grupo-seccion-chip-footer" />
      <span className="grupo-count">
        <i className="pi pi-users" /> {usuarios.length}
      </span>
    </div>
  );

  const renderUsuario = (usuario: GrupoUser) => (
    <div key={usuario.id} className="grupo-usuario-row">
      <div className="usuario-info">
        <UserAvatar
          userId={usuario.id}
          nombre={usuario.nombre}
          apellido={usuario.apellido1}
          hasAvatar={usuario.has_avatar}
          size="medium"
        />
        <span className="usuario-nombre">
          {usuario.nombre} {usuario.apellido1}
        </span>
      </div>

      {/* ✅ Botones de acción */}
      <div className="usuario-actions">
        {/* Botón X para eliminar */}
        <i
          className="pi pi-times remove-member-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveMember(usuario.id);
          }}
          title="Eliminar del grupo"
        />

        {/* Estrella para animadores */}
        {canBeResponsable(usuario) && (
          <i
            className={`pi ${isResponsable(usuario.id) ? 'pi-star-fill' : 'pi-star'} responsable-star ${isResponsable(usuario.id) ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleResponsable(usuario.id);
            }}
            title={
              isResponsable(usuario.id) ? 'Quitar como responsable' : 'Marcar como responsable'
            }
          />
        )}
      </div>
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="grupo-card"
      pt={{
        body: { style: { padding: 0 } },
        content: { style: { padding: 0 } },
      }}
    >
      <div className="grupo-usuarios-list">
        {usuarios.length === 0 ? (
          <div className="grupo-empty-state">
            <i className="pi pi-users" />
            <span>Sin miembros</span>
          </div>
        ) : (
          <>
            {animadores.map(renderUsuario)}
            {animadores.length > 0 && miembros.length > 0 && (
              <div style={{ borderTop: '1px solid #e0e0e0' }} />
            )}
            {miembros.map(renderUsuario)}
          </>
        )}
      </div>
    </Card>
  );
};
