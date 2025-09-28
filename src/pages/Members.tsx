import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MemberCard } from '../components/common/MemberCard';
import { mockRecentMembers, getRoleColor, getSectionColor, RecentMember } from '../data/RecentMembers';

export const Members: React.FC = () => {
  console.log("🚀🚀🚀 MEMBERS COMPONENT RENDERIZADO");

  const [members, setMembers] = useState<RecentMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<RecentMember[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadMembers = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMembers(mockRecentMembers);
      setFilteredMembers(mockRecentMembers);
      setLoading(false);
    };

    loadMembers();
  }, []);

  useEffect(() => {
    let filtered = members;

    if (globalFilter) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        member.email?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        member.role.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role.toLowerCase().includes(roleFilter.toLowerCase()));
    }

    if (sectionFilter) {
      filtered = filtered.filter(member => member.section === sectionFilter);
    }

    setFilteredMembers(filtered);
  }, [members, globalFilter, statusFilter, roleFilter, sectionFilter]);

  // Opciones de estado
  const statusOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];

  // Opciones de rol (basado en los datos)
  const roleOptions = [
    { label: 'Todos los roles', value: '' },
    { label: 'Coordinador General', value: 'coordinador general' },
    { label: 'Responsable de Formación', value: 'responsable de formación' },
    { label: 'Coordinadora de CJ', value: 'coordinadora de cj' },
    { label: 'Responsable de Oración', value: 'responsable de oración' },
    { label: 'Miembro Activo', value: 'miembro activo' },
    { label: 'Miembro Nuevo', value: 'miembro nuevo' }
  ];

  // Opciones de sección
  const sectionOptions = [
    { label: 'Todas las secciones', value: '' },
    { label: 'Chiqui', value: 'Chiqui' },
    { label: 'CJ', value: 'CJ' },
    { label: 'Animador', value: 'Animador' }
  ];

  const avatarBodyTemplate = (member: RecentMember) => {
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

  const statusBodyTemplate = (member: RecentMember) => {
    const severity = member.status === 'active' ? 'success' : 'danger';
    const label = member.status === 'active' ? 'Activo' : 'Inactivo';

    return <Badge value={label} severity={severity} />;
  };

  const roleBodyTemplate = (member: RecentMember) => {
    return (
      <Badge
        value={member.role}
        className={`${getRoleColor(member.role)} text-xs !flex !items-center !justify-center !leading-none px-2 py-1`}
      />
    );
  };

  const sectionBodyTemplate = (member: RecentMember) => {
    return (
      <Badge
        value={member.section}
        className={`${getSectionColor(member.section)} text-xs !flex !items-center !justify-center !leading-none px-2 py-1`}
      />
    );
  };

  const joinDateBodyTemplate = (member: RecentMember) => {
    return new Date(member.joinedDate).toLocaleDateString('es-ES');
  };

  const actionBodyTemplate = (member: RecentMember) => {
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

  const handleView = (member: RecentMember) => {
    console.log('Ver miembro:', member);
  };

  const handleEdit = (member: RecentMember) => {
    console.log('Editar miembro:', member);
  };

  const handleAddMember = () => {
    console.log('Añadir nuevo miembro');
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

        <Dropdown
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.value)}
          options={sectionOptions}
          placeholder="Sección"
          className="w-full sm:w-auto"
        />

        <Button
          label="Nuevo Miembro"
          icon="pi pi-plus"
          className="bg-red-600 border-red-600"
          onClick={handleAddMember}
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
          {filteredMembers.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <i className="pi pi-users text-4xl mb-4 block"></i>
              <p>No se encontraron miembros</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={{
                  ...member,
                  joinDate: member.joinedDate // Mapear campo
                }}
                onView={handleView}
                onEdit={handleEdit}
              />
            ))
          )}
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
            <Column body={roleBodyTemplate} header="Rol" sortable />
            <Column body={sectionBodyTemplate} header="Sección" sortable />
            <Column body={statusBodyTemplate} header="Estado" sortable />
            <Column
              field="joinedDate"
              header="Fecha de Ingreso"
              sortable
              body={joinDateBodyTemplate}
            />
            <Column body={actionBodyTemplate} header="Acciones" style={{ width: '8rem' }} />
          </DataTable>
        </Card>
      )}
    </div>
  );
};
