// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

// ✅ NUEVOS IMPORTS: Sistema de autenticación y API
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useApi';

// Imports existentes
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DailyCards } from '../components/dashboard/DailyCards';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ScheduledActivities } from '../components/dashboard/ScheduledActivities';
import { getDashboardStats, mockCalendarEvents } from '../data';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // ✅ NUEVO: Usar sistema de autenticación
  const { user: currentUser, logout } = useAuth();

  // ✅ NUEVO: Usar hook especializado de usuarios
  const { users, loading: usersLoading, error: usersError, fetchAllUsers } = useUsers();

  // Estados locales para otras entidades (actividades, grupos)
  const [activities, setActivities] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // ✅ NUEVO: Cargar datos al montar el componente
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardLoading(true);

        // Cargar usuarios reales desde la API
        await fetchAllUsers();

        // TODO: Reemplazar con APIs reales cuando estén disponibles
        // const [activitiesData, groupsData] = await Promise.all([
        //   fetchActivities(),
        //   fetchGroups()
        // ]);

        // Por ahora, datos mock para actividades y grupos
        setActivities([]);
        setGroups([]);

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchAllUsers]);

  const dashboardStats = getDashboardStats(
    users.length,
    activities.filter(a => a.status === 'scheduled' || a.status === 'ongoing').length,
    groups.filter(g => g.status === 'active').length
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      <StatsCards stats={dashboardStats} />
      <ScheduledActivities events={mockCalendarEvents}/>
    </div>
  );
};
