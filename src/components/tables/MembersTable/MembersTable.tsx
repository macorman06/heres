// src/components/tables/MembersTable/MembersTable.tsx

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
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
  // Template para Usuario (nombre + email)
  const userTemplate = (rowData: User) => {
    const fullName = formatFullName(rowData.nombre, rowData.apellido1, rowData.apellido2);
    return (
      <div className="user-cell">
        <div className="user-name">{fullName}</div>
        <div className="user-email">{rowData.email}</div>
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
    return <Badge value={rol.label} severity={rol.severity} className="rol-badge" />;
  };

  // Template para Centro Juvenil con Chip
  const centroTemplate = (rowData: User) => {
    if (!rowData.centro_juvenil) return '-';

    // Colores según centro
    const centroColors: Record<string, { bg: string; text: string }> = {
      'CJ Juveliber': { bg: '#DBEAFE', text: '#1E40AF' },
      'CJ La Balsa': { bg: '#D1FAE5', text: '#065F46' },
      'CJ Sotojoven': { bg: '#FDE68A', text: '#92400E' },
    };

    const colors = centroColors[rowData.centro_juvenil] || { bg: '#E5E7EB', text: '#374151' };

    return (
      <Chip
        label={rowData.centro_juvenil}
        className="centro-chip"
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
        }}
      />
    );
  };

  // Template para Sección
  const seccionTemplate = (rowData: User) => {
    if (!rowData.seccion || rowData.seccion.length === 0) return '-';

    return (
      <div className="seccion-chips">
        {rowData.seccion.map((s, idx) => (
          <span key={idx} className="seccion-badge">
            {s}
          </span>
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
      <div className="table-actions-compact">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          onClick={() => onEditUser(rowData)}
          tooltip="Editar usuario"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={users}
      className="members-table"
      stripedRows
      showGridlines
      responsiveLayout="scroll"
      loading={loading}
      emptyMessage="No se encontraron usuarios"
    >
      <Column
        header="Usuario"
        body={userTemplate}
        sortable
        sortField="nombre"
        style={{ minWidth: '250px', maxWidth: '350px' }}
      />
      <Column field="rol" header="Rol" body={rolTemplate} sortable style={{ width: '150px' }} />
      <Column
        field="centro_juvenil"
        header="Centro"
        body={centroTemplate}
        sortable
        style={{ width: '180px' }}
      />
      <Column field="seccion" header="Sección" body={seccionTemplate} style={{ width: '150px' }} />
      <Column
        field="puntuacion"
        header="Puntuación"
        body={pointsTemplate}
        sortable
        style={{ width: '120px' }}
      />
      <Column header="Acciones" body={actionsTemplate} style={{ width: '100px' }} />
    </DataTable>
  );
};
