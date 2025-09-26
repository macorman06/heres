import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MemberCard } from '../components/common/MemberCard';
import { Member } from '../types';
import { formatRole, formatStatus, getAvailableRoles, getAvailableStatuses } from '../utils/roleTranslations';

export const Members: React.FC = () => {
  console.log("🚀🚀🚀 MEMBERS COMPONENT RENDERIZADO");

  const { loading, getMembers } = useApi();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  useEffect(() => {
    const loadMembers = async () => {
      const data = await getMembers();
      setMembers(data);
      setFilteredMembers(data);
    };

    loadMembers();
  }, []);

  useEffect(() => {
    let filtered = members;

    if (globalFilter) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        member.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        member.role.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(member => member.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role.toLowerCase().includes(roleFilter.toLowerCase()));
    }

    setFilteredMembers(filtered);
  }, [members, globalFilter, statusFilter, roleFilter]);

  // Opciones de estado usando las traducciones
  const statusOptions = [
    { label: 'Todos los estados', value: '' },
    ...getAvailableStatuses()
  ];

  // Opciones de rol usando las traducciones
  const roleOptions = [
    { label: 'Todos los roles', value: '' },
    ...getAvailableRoles()
  ];

  const avatarBodyTemplate = (member: Member) => {
    return (
      <Avatar
        image={member.avatar}
        label={member.name.charAt(0)}
        size="normal"
        shape="circle"
        className="bg-red-500 text-white"
      />
    );
  };

  const statusBodyTemplate = (member: Member) => {
    const severity = member.status === 'active' ? 'success' :
      member.status === 'inactive' ? 'danger' : 'warning';

    return <Badge value={formatStatus(member.status)} severity={severity} />;
  };

  const roleBodyTemplate = (member: Member) => {
    return <span>{formatRole(member.role)}</span>;
  };

  const actionBodyTemplate = (member: Member) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-eye"
          size="small"
          outlined
          tooltip="Ver detalles"
          onClick={() => handleView(member)}
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          tooltip="Editar"
          className="bg-red-600 border-red-600"
          onClick={() => handleEdit(member)}
        />
      </div>
    );
  };

  const handleView = (member: Member) => {
    console.log('Ver miembro:', member);
  };

  const handleEdit = (member: Member) => {
    console.log('Editar miembro:', member);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando miembros..." />;
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-bold text-gray-800">
          Miembros ({filteredMembers.length})
        </h2>
        <div className="flex space-x-2">
          <Button
            icon="pi pi-th-large"
            size="small"
            outlined={viewMode !== 'cards'}
            onClick={() => setViewMode('cards')}
            tooltip="Vista de tarjetas"
          />
          <Button
            icon="pi pi-list"
            size="small"
            outlined={viewMode !== 'table'}
            onClick={() => setViewMode('table')}
            tooltip="Vista de tabla"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar miembros..."
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

        <Dropdown
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.value)}
          options={roleOptions}
          placeholder="Rol"
          className="w-full sm:w-auto"
        />

        <Button
          label="Nuevo Miembro"
          icon="pi pi-plus"
          className="bg-red-600 border-red-600"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        {header}
      </Card>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <DataTable
            value={filteredMembers}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="p-datatable-sm"
            emptyMessage="No se encontraron miembros"
            responsiveLayout="scroll"
          >
            <Column body={avatarBodyTemplate} style={{ width: '4rem' }} />
            <Column field="name" header="Nombre" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="role" header="Rol" sortable body={roleBodyTemplate} />
            <Column body={statusBodyTemplate} header="Estado" sortable />
            <Column
              field="joinDate"
              header="Fecha de Ingreso"
              sortable
              body={(member) => new Date(member.joinDate).toLocaleDateString('es-ES')}
            />
            <Column body={actionBodyTemplate} header="Acciones" style={{ width: '8rem' }} />
          </DataTable>
        </Card>
      )}
    </div>
  );
};
