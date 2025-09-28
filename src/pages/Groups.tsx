import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Group } from '../types';

export const Groups: React.FC = () => {
  const { loading, getGroups } = useApi();
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      const data = await getGroups();
      setGroups(data);
      setFilteredGroups(data);
    };

    loadGroups();
  }, []);

  useEffect(() => {
    let filtered = groups;

    if (globalFilter) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        group.description.toLowerCase().includes(globalFilter.toLowerCase()) ||
        group.coordinator.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(group => group.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(group => group.status === statusFilter);
    }

    setFilteredGroups(filtered);
  }, [groups, globalFilter, categoryFilter, statusFilter]);

  const categoryOptions = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Infantil', value: 'Infantil' },
    { label: 'Preadolescente', value: 'Preadolescente' },
    { label: 'Juvenil', value: 'Juvenil' }
  ];

  const statusOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];

  const statusBodyTemplate = (group: Group) => {
    return (
      <Badge 
        value={group.status === 'active' ? 'Activo' : 'Inactivo'} 
        severity={group.status === 'active' ? 'success' : 'danger'} 
      />
    );
  };

  const categoryBodyTemplate = (group: Group) => {
    const categoryColors = {
      'Infantil': 'bg-blue-100 text-blue-800',
      'Preadolescente': 'bg-yellow-100 text-yellow-800',
      'Juvenil': 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        categoryColors[group.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {group.category}
      </span>
    );
  };

  const membersBodyTemplate = (group: Group) => {
    return (
      <div className="flex items-center space-x-2">
        <i className="pi pi-users text-gray-500" />
        <span className="font-medium">{group.memberCount}</span>
      </div>
    );
  };

  const actionBodyTemplate = (group: Group) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-eye"
          size="small"
          outlined
          tooltip="Ver detalles"
          onClick={() => handleView(group)}
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          tooltip="Editar"
          className="bg-red-600 border-red-600"
          onClick={() => handleEdit(group)}
        />
        <Button
          icon="pi pi-users"
          size="small"
          severity="info"
          tooltip="Gestionar miembros"
          onClick={() => handleManageMembers(group)}
        />
      </div>
    );
  };

  const handleView = (group: Group) => {
    console.log('Ver grupo:', group);
  };

  const handleEdit = (group: Group) => {
    console.log('Editar grupo:', group);
  };

  const handleManageMembers = (group: Group) => {
    console.log('Gestionar miembros del grupo:', group);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando grupos..." />;
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Grupos ({filteredGroups.length})
      </h2>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar grupos..."
            className="pl-10"
          />
        </div>
        
        <Dropdown
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.value)}
          options={categoryOptions}
          placeholder="Categoría"
          className="w-full sm:w-auto"
        />
        
        <Dropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.value)}
          options={statusOptions}
          placeholder="Estado"
          className="w-full sm:w-auto"
        />
        
        <Button
          label="Nuevo Grupo"
          icon="pi pi-plus"
          className="bg-red-600 border-red-600"
        />
      </div>
    </div>
  );

  const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Grupos', value: groups.length, color: 'bg-purple-500', icon: 'pi-sitemap' },
          { label: 'Grupos Activos', value: groups.filter(g => g.status === 'active').length, color: 'bg-green-500', icon: 'pi-check-circle' },
          { label: 'Total Miembros', value: totalMembers, color: 'bg-blue-500', icon: 'pi-users' },
          { label: 'Promedio por Grupo', value: Math.round(totalMembers / groups.length) || 0, color: 'bg-orange-500', icon: 'pi-chart-bar' }
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-md bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className={`pi ${stat.icon} text-white text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Groups Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{group.description}</p>
                </div>
                <Badge 
                  value={group.status === 'active' ? 'Activo' : 'Inactivo'} 
                  severity={group.status === 'active' ? 'success' : 'danger'} 
                />
              </div>

              <div className="flex items-center justify-between">
                {categoryBodyTemplate(group)}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <i className="pi pi-users" />
                  <span className="font-medium">{group.memberCount} miembros</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-1">
                  <i className="pi pi-user mr-2" />
                  Coordinador: {group.coordinator}
                </p>
                <p>
                  <i className="pi pi-calendar mr-2" />
                  Creado: {new Date(group.createdDate).toLocaleDateString('es-ES')}
                </p>
              </div>

              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <Button
                  label="Ver Detalles"
                  icon="pi pi-eye"
                  size="small"
                  outlined
                  className="flex-1"
                  onClick={() => handleView(group)}
                />
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  tooltip="Editar"
                  className="bg-red-600 border-red-600"
                  onClick={() => handleEdit(group)}
                />
                <Button
                  icon="pi pi-users"
                  size="small"
                  severity="info"
                  tooltip="Gestionar miembros"
                  onClick={() => handleManageMembers(group)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};