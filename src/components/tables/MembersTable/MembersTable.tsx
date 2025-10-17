// src/components/tables/MembersTable/MembersTable.tsx

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { UserAvatar } from '../../common/UserAvatar';
import { formatFullName } from '../../../utils/formatters';
import type { User } from '../../../types/user.types';
import './MembersTable.css';

interface MembersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  canEditUser: (user: User) => boolean;
  loading?: boolean;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  users,
  onEditUser,
  canEditUser,
  loading = false,
}) => {
  const avatarTemplate = (rowData: User) => {
    return (
      <UserAvatar
        userId={rowData.id}
        nombre={rowData.nombre}
        apellido={rowData.apellido1}
        hasAvatar={!!rowData.foto_perfil}
        size="medium"
      />
    );
  };

  // Template para Usuario (nombre + email)
  const userTemplate = (rowData: User) => {
    const fullName = formatFullName(rowData.nombre, rowData.apellido1, rowData.apellido2);
    return (
      <div className="user-cell">
        <span className="user-name">{fullName}</span>
        <span className="user-email">{rowData.email}</span>
      </div>
    );
  };

  // Template para Rol con Badge
  const rolTemplate = (rowData: User) => {
    const rolMap: Record<
      string,
      { label: string; severity: 'danger' | 'warning' | 'success' | 'info' }
    > = {
      superuser: { label: 'Superusuario', severity: 'danger' },
      director: { label: 'Director', severity: 'danger' },
      coordinador: { label: 'Coordinador', severity: 'warning' },
      animador: { label: 'Animador', severity: 'success' },
      miembro: { label: 'Miembro', severity: 'info' },
    };

    const rol = rolMap[rowData.rol?.toLowerCase()] || { label: 'Usuario', severity: 'info' };
    return <Badge value={rol.label} severity={rol.severity} />;
  };

  // Template para Grupo
  const grupoTemplate = (rowData: User) => {
    if (!rowData.grupo_nombre) return <span className="text-muted">-</span>;
    return (
      <Chip
        label={rowData.grupo_nombre}
        style={{
          backgroundColor: rowData.grupo_color || '#E5E7EB',
          color: '#1F2937',
        }}
      />
    );
  };

  // Template para Centro Juvenil con Chip
  const centroTemplate = (rowData: User) => {
    if (!rowData.centro_juvenil) return '-';

    const centroColors: Record<string, { bg: string; text: string }> = {
      'CJ Juveliber': { bg: '#DBEAFE', text: '#1E40AF' },
      'CJ La Balsa': { bg: '#D1FAE5', text: '#065F46' },
      'CJ Sotojoven': { bg: '#FDE68A', text: '#92400E' },
    };

    const colors = centroColors[rowData.centro_juvenil] || { bg: '#E5E7EB', text: '#374151' };

    return (
      <Chip
        label={rowData.centro_juvenil}
        style={{ backgroundColor: colors.bg, color: colors.text }}
      />
    );
  };

  // Template para Sección
  const seccionTemplate = (rowData: User) => {
    if (!rowData.seccion || rowData.seccion.length === 0) return '-';

    return (
      <div className="seccion-chips">
        {rowData.seccion.map((s, idx) => (
          <Chip key={idx} label={s} className="seccion-chip" />
        ))}
      </div>
    );
  };

  // Template para Puntuación
  const pointsTemplate = (rowData: User) => {
    return (
      <div className="points-cell">
        <span className="points-value">{rowData.puntuacion || 0}</span>
        <span className="points-label">pts</span>
      </div>
    );
  };

  // Template para Acciones
  const actionsTemplate = (rowData: User) => {
    if (!canEditUser(rowData)) {
      return null;
    }

    return (
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => onEditUser(rowData)}
        tooltip="Editar usuario"
        tooltipOptions={{ position: 'left' }}
      />
    );
  };

  return (
    <DataTable
      value={users}
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      dataKey="id"
      emptyMessage="No se encontraron usuarios"
      className="members-table"
      stripedRows
    >
      <Column body={avatarTemplate} style={{ width: '30px', textAlign: 'center' }} frozen />

      <Column
        field="nombre"
        header="Usuario"
        body={userTemplate}
        sortable
        style={{ minWidth: '250px' }}
      />
      <Column field="rol" header="Rol" body={rolTemplate} sortable style={{ width: '150px' }} />
      <Column
        field="grupo_nombre"
        header="Grupo"
        body={grupoTemplate}
        sortable
        style={{ width: '150px' }}
      />
      <Column
        field="centro_juvenil"
        header="Centro"
        body={centroTemplate}
        sortable
        style={{ width: '180px' }}
      />
      <Column
        field="seccion"
        header="Secciones"
        body={seccionTemplate}
        style={{ width: '180px' }}
      />
      <Column
        field="puntuacion"
        header="Puntuación"
        body={pointsTemplate}
        sortable
        style={{ width: '120px' }}
      />
      <Column
        body={actionsTemplate}
        style={{ width: '80px', textAlign: 'center' }}
        frozen
        alignFrozen="right"
      />
    </DataTable>
  );
};
