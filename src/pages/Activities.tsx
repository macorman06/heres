import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Activity } from '../types';

export const Activities: React.FC = () => {
  const { loading, getActivities } = useApi();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const loadActivities = async () => {
      const data = await getActivities();
      setActivities(data);
      setFilteredActivities(data);
    };

    loadActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (globalFilter) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        activity.description.toLowerCase().includes(globalFilter.toLowerCase()) ||
        activity.location.toLowerCase().includes(globalFilter.toLowerCase()) ||
        activity.coordinator.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(activity => activity.status === statusFilter);
    }

    setFilteredActivities(filtered);
  }, [activities, globalFilter, statusFilter]);

  const statusOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Programada', value: 'scheduled' },
    { label: 'En curso', value: 'ongoing' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' }
  ];

  const statusBodyTemplate = (activity: Activity) => {
    const statusConfig = {
      scheduled: { label: 'Programada', severity: 'info' as const },
      ongoing: { label: 'En curso', severity: 'warning' as const },
      completed: { label: 'Completada', severity: 'success' as const },
      cancelled: { label: 'Cancelada', severity: 'danger' as const }
    };

    const config = statusConfig[activity.status];
    return <Badge value={config.label} severity={config.severity} />;
  };

  const participantsBodyTemplate = (activity: Activity) => {
    const percentage = (activity.participants / activity.maxParticipants) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{activity.participants}/{activity.maxParticipants}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <ProgressBar 
          value={percentage} 
          className="h-2"
          color={percentage > 80 ? '#ef4444' : percentage > 60 ? '#f59e0b' : '#10b981'}
        />
      </div>
    );
  };

  const dateBodyTemplate = (activity: Activity) => {
    return (
      <div>
        <div className="font-medium">
          {new Date(activity.date).toLocaleDateString('es-ES')}
        </div>
        <div className="text-sm text-gray-500">{activity.time}</div>
      </div>
    );
  };

  const actionBodyTemplate = (activity: Activity) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-eye"
          size="small"
          outlined
          tooltip="Ver detalles"
          onClick={() => handleView(activity)}
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          tooltip="Editar"
          className="bg-red-600 border-red-600"
          onClick={() => handleEdit(activity)}
        />
        {activity.status === 'scheduled' && (
          <Button
            icon="pi pi-play"
            size="small"
            severity="success"
            tooltip="Iniciar actividad"
            onClick={() => handleStart(activity)}
          />
        )}
      </div>
    );
  };

  const handleView = (activity: Activity) => {
    console.log('Ver actividad:', activity);
  };

  const handleEdit = (activity: Activity) => {
    console.log('Editar actividad:', activity);
  };

  const handleStart = (activity: Activity) => {
    console.log('Iniciar actividad:', activity);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando actividades..." />;
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <h2 className="text-xl font-bold text-gray-800">
        Actividades ({filteredActivities.length})
      </h2>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar actividades..."
            className="pl-10"
          />
        </div>
        
        <Dropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.value)}
          options={statusOptions}
          placeholder="Estado"
          className="w-full sm:w-auto"
        />
        
        <Button
          label="Nueva Actividad"
          icon="pi pi-plus"
          className="bg-red-600 border-red-600"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: activities.length, color: 'bg-blue-500' },
          { label: 'Programadas', value: activities.filter(a => a.status === 'scheduled').length, color: 'bg-yellow-500' },
          { label: 'En Curso', value: activities.filter(a => a.status === 'ongoing').length, color: 'bg-orange-500' },
          { label: 'Completadas', value: activities.filter(a => a.status === 'completed').length, color: 'bg-green-500' }
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className="pi pi-calendar text-white text-xl" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <div className="mb-4">{header}</div>
        
        <DataTable
          value={filteredActivities}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          emptyMessage="No se encontraron actividades"
          responsiveLayout="scroll"
        >
          <Column field="title" header="Título" sortable className="font-medium" />
          <Column field="description" header="Descripción" />
          <Column body={dateBodyTemplate} header="Fecha y Hora" sortable />
          <Column field="location" header="Ubicación" />
          <Column field="coordinator" header="Coordinador" sortable />
          <Column body={participantsBodyTemplate} header="Participantes" />
          <Column body={statusBodyTemplate} header="Estado" sortable />
          <Column body={actionBodyTemplate} header="Acciones" style={{ width: '12rem' }} />
        </DataTable>
      </Card>
    </div>
  );
};