// src/pages/Ranking.tsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { userService } from '../services/api/index';
import type { User } from '../types';
import { formatFullName, getUserInitials } from '../utils/formatters';
import * as XLSX from 'xlsx';

type SortField = 'nombre' | 'puntuacion';
type SortOrder = 'asc' | 'desc';

export interface ColumnBodyOptions {
  rowIndex: number;
  columnIndex?: number;
  rowData?: any;
  column?: any;
  field?: string;
  frozenRow?: boolean;
  props?: any;
}

/**
 * Página de ranking de miembros
 * Muestra una clasificación de usuarios con rol de miembro ordenados por puntuación o nombre
 */
export const Ranking: React.FC = () => {
  // === STATE ===
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('puntuacion');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const toast = useRef<Toast>(null);

  // === EFFECTS ===
  useEffect(() => {
    fetchRanking();
  }, []);

  // === HANDLERS ===
  /**
   * Obtiene el ranking desde la API
   */
  const fetchRanking = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getRanking();
      setUsers(data);
    } catch (error) {
      console.error('❌ Error al cargar el ranking:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error instanceof Error ? error.message : 'Error al cargar el ranking',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cambia el campo y orden de clasificación
   */
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder(field === 'puntuacion' ? 'desc' : 'asc');
      }
    },
    [sortField]
  );

  /**
   * Exporta el ranking a Excel
   */
  const exportToExcel = useCallback(() => {
    try {
      // Preparar datos para exportación
      const exportData = sortedUsers.map((user, index) => ({
        Posición: index + 1,
        Nombre: user.nombre,
        Apellido: `${user.apellido1 || ''}`.trim(),
        Puntuación: user.puntuacion || 0,
      }));

      // Crear libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ranking');

      // Ajustar ancho de columnas
      const maxWidths = [
        { wch: 10 }, // Posición
        { wch: 20 }, // Nombre
        { wch: 30 }, // Apellido
        { wch: 12 }, // Puntuación
      ];
      worksheet['!cols'] = maxWidths;

      // Descargar archivo
      const fileName = `ranking_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Ranking exportado correctamente',
        life: 3000,
      });
    } catch (error) {
      console.error('❌ Error al exportar:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al exportar el ranking',
        life: 3000,
      });
    }
  }, [users]);

  // === COMPUTED VALUES ===
  /**
   * Usuarios ordenados según los criterios seleccionados
   */
  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'nombre') {
        const nameA = `${a.nombre} ${a.apellido1 || ''}`.toLowerCase();
        const nameB = `${b.nombre} ${b.apellido1 || ''}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (sortField === 'puntuacion') {
        comparison = (a.puntuacion || 0) - (b.puntuacion || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [users, sortField, sortOrder]);

  /**
   * Estadísticas del ranking
   */
  const statistics = useMemo(() => {
    const totalMembers = users.length;
    const avgScore =
      totalMembers > 0
        ? Math.round(users.reduce((acc, u) => acc + (u.puntuacion || 0), 0) / totalMembers)
        : 0;
    const maxScore = totalMembers > 0 ? Math.max(...users.map((u) => u.puntuacion || 0)) : 0;
    return { totalMembers, avgScore, maxScore };
  }, [users]);

  // === COLUMN TEMPLATES ===
  /**
   * Template para mostrar el ranking (posición)
   */
  const rankTemplate = useCallback((_rowData: User, options: ColumnBodyOptions) => {
    const rank = options.rowIndex + 1;
    let badgeClass = 'bg-gray-400';
    let icon = '';

    if (rank === 1) {
      badgeClass = 'bg-yellow-500';
      icon = '👑';
    } else if (rank === 2) {
      badgeClass = 'bg-gray-300';
      icon = '🥈';
    } else if (rank === 3) {
      badgeClass = 'bg-orange-600';
      icon = '🥉';
    }

    return (
      <div className="flex items-center gap-2">
        <Badge value={rank} size="large" className={badgeClass} />
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    );
  }, []);

  /**
   * Template para mostrar la información del usuario
   */
  const userTemplate = useCallback((rowData: User) => {
    const fullName = formatFullName(rowData.nombre, rowData.apellido1, rowData.apellido2);
    const initials = getUserInitials(rowData.nombre, rowData.apellido1);
    console.log('User initials:', initials);
    console.log('Full name:', fullName);

    return (
      <div className="flex items-center gap-3">
        <Avatar label={initials} size="large" shape="circle" />
        <div>
          <div className="font-semibold">{fullName}</div>
          {rowData.centro_juvenil && (
            <div className="text-sm text-gray-500">{rowData.centro_juvenil}</div>
          )}
          {rowData.seccion && rowData.seccion.length > 0 && (
            <div className="text-xs text-blue-600">
              {Array.isArray(rowData.seccion) ? rowData.seccion.join(', ') : rowData.seccion}
            </div>
          )}
        </div>
      </div>
    );
  }, []);

  /**
   * Template para mostrar la puntuación
   */
  const pointsTemplate = useCallback((rowData: User) => {
    const points = rowData.puntuacion || 0;
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">{points}</span>
        <span className="text-sm text-gray-500">pts</span>
      </div>
    );
  }, []);

  // === RENDER ===
  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">🏆 Ranking de Miembros</h1>
        <p className="text-gray-600">Clasificación de miembros por puntuación.</p>
      </div>

      {/* Controles de ordenamiento y exportación */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <span className="font-semibold">Ordenar por:</span>
        <Button
          label="Nombre"
          icon="pi pi-sort-alpha-down"
          onClick={() => handleSort('nombre')}
          className={sortField === 'nombre' ? 'btn-primary' : 'btn-secondary'}
        />
        <Button
          label="Puntuación"
          icon="pi pi-sort-amount-down"
          onClick={() => handleSort('puntuacion')}
          className={sortField === 'puntuacion' ? 'btn-primary' : 'btn-secondary'}
        />
        <Badge value={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'} />

        {/* Botón de exportación */}
        <Button
          label="Exportar a Excel"
          icon="pi pi-file-excel"
          onClick={exportToExcel}
          className="btn-primary ml-auto"
          disabled={users.length === 0}
        />
      </div>

      {/* Top 3 destacado */}
      {sortField === 'puntuacion' && sortOrder === 'desc' && sortedUsers.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {sortedUsers.slice(0, 3).map((user, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            const colors = [
              'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20',
              'bg-gray-50 border-gray-300 dark:bg-gray-900/20',
              'bg-orange-50 border-orange-300 dark:bg-orange-900/20',
            ];
            const fullName = `${user.nombre} ${user.apellido1 || ''}`.trim();
            const initials =
              `${user.nombre.charAt(0)}${user.apellido1?.charAt(0) || ''}`.toUpperCase();

            return (
              <Card
                key={user.id}
                className={`border-2 ${colors[index]} text-center transition-transform hover:scale-105`}
              >
                <div className="text-6xl mb-3">{medals[index]}</div>
                <Avatar label={initials} size="xlarge" shape="circle" className="mb-3" />
                <h3 className="text-xl font-bold mb-2">{fullName}</h3>
                {user.centro_juvenil && (
                  <p className="text-sm text-gray-500 mb-2">{user.centro_juvenil}</p>
                )}
                <div className="text-3xl font-bold text-primary">
                  {user.puntuacion || 0}
                  <span className="text-sm text-gray-500 ml-2">pts</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-2">Total Miembros</div>
            <div className="text-3xl font-bold text-primary">{statistics.totalMembers}</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-2">Puntuación Media</div>
            <div className="text-3xl font-bold text-primary">{statistics.avgScore}</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-2">Puntuación Máxima</div>
            <div className="text-3xl font-bold text-primary">{statistics.maxScore}</div>
          </div>
        </Card>
      </div>

      {/* Tabla completa */}
      <Card>
        <DataTable
          value={sortedUsers}
          loading={loading}
          rows={100}
          emptyMessage="No hay miembros registrados"
          stripedRows
          className="ranking-table"
        >
          <Column header="#" body={rankTemplate} style={{ width: '120px' }} frozen />
          <Column header="Miembro" body={userTemplate} style={{ minWidth: '300px' }} />
          <Column
            header="Puntuación"
            body={pointsTemplate}
            style={{ width: '200px', textAlign: 'right' }}
          />
        </DataTable>
      </Card>
    </div>
  );
};
