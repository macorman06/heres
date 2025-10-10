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

// Importar el servicio API
import { getRankings } from '../services/api';
import type { User } from '../types';

type SortField = 'nombre' | 'puntuacion';
type SortOrder = 'asc' | 'desc';

export interface ColumnBodyOptions {
  /** Índice de la fila actual (0-based) */
  rowIndex: number;
  /** Índice de la columna actual */
  columnIndex?: number;
  /** Datos de la fila actual */
  rowData?: any;
  /** Propiedades de la columna */
  column?: any;
  /** Información del campo */
  field?: string;
  /** Si la fila está congelada */
  frozenRow?: boolean;
  /** Props adicionales */
  props?: any;
}

/**
 * Página de ranking de miembros
 * Muestra una clasificación de usuarios con rol de miembro ordenados por puntuación o nombre
 */
export const Ranking: React.FC = () => {
  // === STATE ===
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      const data = await getRankings();
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
        <Badge
          value={rank.toString()}
          className={`${badgeClass} text-white font-bold text-lg`}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    );
  }, []);

  /**
   * Template para mostrar la información del usuario
   */
  const userTemplate = useCallback((rowData: User) => {
    const fullName =
      `${rowData.nombre} ${rowData.apellido1 || ''} ${rowData.apellido2 || ''}`.trim();
    const initials =
      `${rowData.nombre.charAt(0)}${rowData.apellido1?.charAt(0) || ''}`.toUpperCase();

    return (
      <div className="flex items-center gap-3">
        <Avatar
          label={initials}
          size="large"
          shape="circle"
          className="bg-red-500 text-white font-bold"
          style={{ width: '50px', height: '50px' }}
        />
        <div>
          <div className="font-semibold text-lg dark:text-white">{fullName}</div>
          {rowData.centro_juvenil && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{rowData.centro_juvenil}</div>
          )}
          {rowData.seccion && rowData.seccion.length > 0 && (
            <div className="text-xs text-gray-400">
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
      <div className="flex items-center gap-2 justify-end">
        <i className="pi pi-star-fill text-yellow-500 text-xl" />
        <span className="font-bold text-2xl text-red-600">{points}</span>
        <span className="text-gray-500 dark:text-gray-400">pts</span>
      </div>
    );
  }, []);

  // === RENDER ===
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏆 Ranking de Miembros
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Clasificación de miembros por puntuación.
        </p>
      </div>

      {/* Controles de ordenamiento */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ordenar por:</span>
            <Button
              label="Nombre"
              icon="pi pi-sort-alpha-down"
              onClick={() => handleSort('nombre')}
              className={sortField === 'nombre' ? 'btn-primary' : 'btn-secondary'}
            />
            <Button
              label="Puntuación"
              icon="pi pi-sort-numeric-down"
              onClick={() => handleSort('puntuacion')}
              className={sortField === 'puntuacion' ? 'btn-primary' : 'btn-secondary'}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <i
                className={`pi ${sortOrder === 'asc' ? 'pi-arrow-up' : 'pi-arrow-down'} text-red-600`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              </span>
            </div>
            <Button
              icon="pi pi-refresh"
              onClick={fetchRanking}
              loading={loading}
              className="p-button-outlined p-button-secondary"
              tooltip="Actualizar ranking"
              tooltipOptions={{ position: 'top' }}
            />
          </div>
        </div>
      </Card>

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
              <Card key={user.id} className={`border-2 ${colors[index]}`}>
                <div className="text-center">
                  <div className="text-6xl mb-3">{medals[index]}</div>
                  <Avatar
                    label={initials}
                    size="xlarge"
                    shape="circle"
                    className="bg-red-500 text-white font-bold mb-3"
                    style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                  />
                  <h3 className="font-bold text-xl mb-2 dark:text-white">{fullName}</h3>
                  {user.centro_juvenil && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {user.centro_juvenil}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <i className="pi pi-star-fill text-yellow-500 text-2xl" />
                    <span className="font-bold text-3xl text-red-600">{user.puntuacion || 0}</span>
                    <span className="text-gray-500 dark:text-gray-400">pts</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <i className="pi pi-users text-4xl text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Miembros</p>
              <p className="text-2xl font-bold dark:text-white">{statistics.totalMembers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <i className="pi pi-chart-line text-4xl text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Puntuación Media</p>
              <p className="text-2xl font-bold dark:text-white">{statistics.avgScore}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <i className="pi pi-trophy text-4xl text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Puntuación Máxima</p>
              <p className="text-2xl font-bold dark:text-white">{statistics.maxScore}</p>
            </div>
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
