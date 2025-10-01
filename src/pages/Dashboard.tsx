// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useUsers } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DailyCards } from '../components/dashboard/DailyCards';
import { ScheduledActivities } from '../components/dashboard/ScheduledActivities';
import { mockCalendarEvents } from '../data';

export const Dashboard: React.FC = () => {
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
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  // Error state
  if (usersError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <i className="pi pi-exclamation-triangle text-4xl text-orange-500 mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Error cargando datos
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{usersError}</p>
        <Button
          label="Reintentar"
          icon="pi pi-refresh"
          onClick={() => fetchAllUsers()}
          className="p-button-outlined"
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container space-y-6">
      <DailyCards />
      <ScheduledActivities events={mockCalendarEvents}/>
    </div>
  );
};
