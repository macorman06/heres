// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useUsers } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DailyCards } from '../components/dashboard/DailyCards';
import { ScheduledActivities } from '../components/dashboard/ScheduledActivities';
import { mockCalendarEvents } from '../data';
import { ROLES } from '../types/user.types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth(); // Obtener usuario actual
  const { loading: usersLoading, error: usersError, fetchAllUsers } = useUsers();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardLoading(true);
        await fetchAllUsers();
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchAllUsers]);

  // Loading state
  if (dashboardLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (usersError) {
    return (
      <div className="p-6">
        <div className="text-red-600">{usersError}</div>
      </div>
    );
  }

  if (user?.rol_id === ROLES.MIEMBRO) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full text-center">
          <div className="mb-4">
            <i className="pi pi-lock text-6xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Acceso No Autorizado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tienes permisos para acceder al Dashboard.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Esta sección está disponible solo para coordinadores, animadores y directores.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Bienvenido al panel de control</p>
        </div>
        <Button
          label="Actualizar"
          icon="pi pi-refresh"
          onClick={fetchAllUsers}
          loading={usersLoading}
        />
      </div>

      <DailyCards />

      <div className="mt-6">
        <ScheduledActivities events={mockCalendarEvents} />
      </div>
    </div>
  );
};
