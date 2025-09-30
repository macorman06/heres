// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Skeleton } from 'primereact/skeleton';

// ✅ NUEVOS IMPORTS: Sistema de autenticación y API
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useApi';

// Imports existentes
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DailyCards } from '../components/dashboard/DailyCards';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ScheduledActivities } from '../components/dashboard/ScheduledActivities';
import { NewsFeed } from '../components/news/NewsFeed';
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

  // ✅ NUEVO: Calcular estadísticas basadas en datos reales
  const dashboardStats = getDashboardStats(
    users.length,
    activities.filter(a => a.status === 'scheduled' || a.status === 'ongoing').length,
    groups.filter(g => g.status === 'active').length
  );

  // ✅ NUEVO: Obtener miembros recientes reales
  const recentMembers = users
    .sort((a, b) => new Date(b.fecha_creacion || 0).getTime() - new Date(a.fecha_creacion || 0).getTime())
    .slice(0, 6);

  // Handlers existentes
  const handleActivityAction = (eventId: string) => {
    console.log('Acción en actividad:', eventId);
  };

  const handleViewAllMembers = () => {
    navigate('/miembros');
  };

  const handleMemberClick = (memberId: number) => {
    console.log('Ver perfil del miembro:', memberId);
    // TODO: Implementar navegación al perfil del miembro
  };

  // ✅ NUEVO: Handler para cerrar sesión
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
      {/* ✅ NUEVA SECCIÓN: Bienvenida personalizada */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              label={`${currentUser?.nombre?.charAt(0) || ''}${currentUser?.apellido1?.charAt(0) || ''}`}
              size="large"
              shape="circle"
              className="bg-blue-500 text-white"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ¡Hola, {currentUser?.nombre}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {currentUser?.rol || 'Usuario'} en {currentUser?.centro_juvenil || 'HERES'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              value={`${users.length} miembros`}
              className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
            />
            <Button
              icon="pi pi-sign-out"
              className="p-button-text p-button-rounded"
              onClick={handleLogout}
              tooltip="Cerrar sesión"
              tooltipOptions={{ position: 'left' }}
            />
          </div>
        </div>
      </div>

      {/* Daily Cards */}
      <DailyCards />

      {/* ✅ ACTUALIZADA: Stats Cards con datos reales */}
      <StatsCards stats={dashboardStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ NUEVA SECCIÓN: Miembros recientes */}
        <Card title="Miembros Recientes" className="h-fit">
          <div className="space-y-4">
            {recentMembers.length > 0 ? (
              <>
                {recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleMemberClick(member.id)}
                  >
                    <Avatar
                      label={`${member.nombre.charAt(0)}${member.apellido1?.charAt(0) || ''}`}
                      size="normal"
                      shape="circle"
                      className="bg-green-500 text-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {member.nombre} {member.apellido1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.centro_juvenil}
                      </p>
                    </div>
                    <Badge
                      value={member.rol || 'Miembro'}
                      severity="info"
                      className="text-xs"
                    />
                  </div>
                ))}
                <Button
                  label="Ver todos los miembros"
                  icon="pi pi-arrow-right"
                  className="w-full p-button-outlined"
                  onClick={handleViewAllMembers}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <i className="pi pi-users text-3xl text-gray-400 mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400">
                  No hay miembros registrados aún
                </p>
                <Button
                  label="Agregar primer miembro"
                  icon="pi pi-plus"
                  className="mt-3"
                  onClick={handleViewAllMembers}
                />
              </div>
            )}
          </div>
        </Card>

        {/* Scheduled Activities */}
        <ScheduledActivities
          events={mockCalendarEvents}
          onActionClick={handleActivityAction}
        />
      </div>

      {/* News Feed */}
      <NewsFeed />

      {/* ✅ NUEVA SECCIÓN: Accesos rápidos */}
      <Card title="Accesos Rápidos" className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            label="Gestionar Miembros"
            icon="pi pi-users"
            className="p-button-outlined flex-col h-20"
            onClick={() => navigate('/miembros')}
          />
          <Button
            label="Actividades"
            icon="pi pi-calendar"
            className="p-button-outlined flex-col h-20"
            onClick={() => navigate('/actividades')}
          />
          <Button
            label="Materiales"
            icon="pi pi-box"
            className="p-button-outlined flex-col h-20"
            onClick={() => navigate('/materiales')}
          />
          <Button
            label="Contacto"
            icon="pi pi-phone"
            className="p-button-outlined flex-col h-20"
            onClick={() => navigate('/contacto')}
          />
        </div>
      </Card>
    </div>
  );
};
