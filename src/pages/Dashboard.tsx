import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DailyCards } from '../components/dashboard/DailyCards';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ScheduledActivities } from '../components/dashboard/ScheduledActivities';
import { NewsFeed } from '../components/news/NewsFeed';
import { getDashboardStats, mockCalendarEvents, getRecentMembers } from '../data';
import { Member, Activity, Group } from '../types';

export const Dashboard: React.FC = () => {
  const { loading, getMembers, getActivities, getGroups } = useApi();
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [membersData, activitiesData, groupsData] = await Promise.all([
        getMembers(),
        getActivities(),
        getGroups()
      ]);
      setMembers(membersData);
      setActivities(activitiesData);
      setGroups(groupsData);
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  // Calcular estadísticas dinámicamente
  const dashboardStats = getDashboardStats(
    members.length,
    activities.filter(a => a.status === 'scheduled' || a.status === 'ongoing').length,
    groups.filter(g => g.status === 'active').length
  );

  // Obtener miembros recientes mockeados
  const recentMembers = getRecentMembers(6);

  // Handlers
  const handleActivityAction = (eventId: string) => {
    console.log('Acción en actividad:', eventId);
    // Aquí podrías abrir un modal con detalles de la actividad
  };

  const handleViewAllMembers = () => {
    console.log('Navegar a la página de miembros');
    // Aquí podrías navegar a la página completa de miembros
  };

  const handleMemberClick = (memberId: string) => {
    console.log('Ver perfil del miembro:', memberId);
    // Aquí podrías abrir el perfil del miembro o navegar a su página
  };

  return (
    <div className="space-y-6">
      {/* Daily Cards */}
      <DailyCards />

      {/* Stats Cards */}
      <StatsCards stats={dashboardStats} loading={loading} />

      {/* Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduled Activities */}
        <div className="lg:col-span-2">
          <ScheduledActivities
            events={mockCalendarEvents}
            loading={loading}
            onActivityAction={handleActivityAction}
          />
        </div>

        {/* News Feed */}
        <div>
          <NewsFeed
            maxItems={4}
            showHeader={false}
            showLoadMore={false}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
};
