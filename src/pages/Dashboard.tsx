import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Badge } from 'primereact/badge';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
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

  const chartData = {
    labels: ['Chiquicentro', 'Preadolescentes', 'Juvenil'],
    datasets: [
      {
        label: 'Miembros por Grupo',
        data: groups.map(g => g.memberCount),
        backgroundColor: ['#ef4444', '#f97316', '#eab308'],
        borderColor: ['#dc2626', '#ea580c', '#ca8a04'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  const stats = [
    {
      title: 'Total Miembros',
      value: members.length,
      icon: 'pi pi-users',
      color: 'bg-blue-500',
      change: '+2 este mes'
    },
    {
      title: 'Actividades Activas',
      value: activities.filter(a => a.status === 'scheduled' || a.status === 'ongoing').length,
      icon: 'pi pi-calendar',
      color: 'bg-green-500',
      change: '3 programadas'
    },
    {
      title: 'Grupos Activos',
      value: groups.filter(g => g.status === 'active').length,
      icon: 'pi pi-sitemap',
      color: 'bg-purple-500',
      change: 'Todos activos'
    },
    {
      title: 'Participación',
      value: '89%',
      icon: 'pi pi-chart-line',
      color: 'bg-red-500',
      change: '+5% vs mes anterior'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido al Dashboard!</h1>
        <p className="text-red-100">
          Aquí tienes un resumen de la actividad del Centro Juvenil Salesianos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card title="Próximas Actividades" className="border-0 shadow-md">
          <div className="space-y-4">
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString('es-ES')} - {activity.time}
                  </p>
                  <p className="text-xs text-gray-500">{activity.location}</p>
                </div>
                <Badge 
                  value={activity.status === 'scheduled' ? 'Programada' : 
                        activity.status === 'ongoing' ? 'En curso' : 'Completada'} 
                  severity={activity.status === 'scheduled' ? 'info' : 
                           activity.status === 'ongoing' ? 'warning' : 'success'}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Groups Chart */}
        <Card title="Distribución por Grupos" className="border-0 shadow-md">
          <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full h-64" />
        </Card>
      </div>

      {/* Recent Members */}
      <Card title="Miembros Recientes" className="border-0 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.slice(0, 6).map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
              <Badge 
                value={member.status === 'active' ? 'Activo' : 'Inactivo'} 
                severity={member.status === 'active' ? 'success' : 'danger'}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};