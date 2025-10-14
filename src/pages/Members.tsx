// src/pages/Members.tsx

import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Message } from 'primereact/message';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/api/index';
import { formatFullName } from '../utils/formatters';
import type { User } from '../types/user.types';
import type { MenuItem } from 'primereact/menuitem';
import { UserEditDialog } from '../components/dialog/UserEditDialog/UserEditDialog.tsx';
import '../styles/4-pages/members.css';

export const Members: React.FC = () => {
  const { user: currentUser } = useAuth();
  const toast = useRef<Toast>(null);

  // Menu refs
  const rolMenuRef = useRef<Menu>(null);
  const centroMenuRef = useRef<Menu>(null);
  const seccionMenuRef = useRef<Menu>(null);

  // ========================================
  // STATE
  // ========================================

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter] = useState('');

  const isSuperUser = currentUser?.rol_id === 1;
  const userCentro = currentUser?.centro_juvenil || '';

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtros seleccionados
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCentros, setSelectedCentros] = useState<string[]>([]);
  const [selectedSecciones, setSelectedSecciones] = useState<string[]>([]);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, selectedRoles, selectedCentros, selectedSecciones, globalFilter]);

  // ========================================
  // DATA FETCHING
  // ========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      const filteredData = isSuperUser ? data : data.filter((u) => u.centro_juvenil === userCentro);
      setUsers(filteredData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar usuarios',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FILTRADO
  // ========================================

  const applyFilters = () => {
    let filtered = [...users];

    // Filtro por roles
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((u) => selectedRoles.includes(u.rol));
    }

    // Filtro por centros
    if (selectedCentros.length > 0) {
      filtered = filtered.filter(
        (u) => u.centro_juvenil && selectedCentros.includes(u.centro_juvenil)
      );
    }

    // Filtro por secciones
    if (selectedSecciones.length > 0) {
      filtered = filtered.filter((u) => u.seccion?.some((s) => selectedSecciones.includes(s)));
    }

    // Filtro global (búsqueda por texto)
    if (globalFilter) {
      const searchLower = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.nombre?.toLowerCase().includes(searchLower) ||
          u.apellido1?.toLowerCase().includes(searchLower) ||
          u.apellido2?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  };

  // ========================================
  // MENU ITEMS
  // ========================================

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleCentro = (centro: string) => {
    setSelectedCentros((prev) =>
      prev.includes(centro) ? prev.filter((c) => c !== centro) : [...prev, centro]
    );
  };

  const toggleSeccion = (seccion: string) => {
    setSelectedSecciones((prev) =>
      prev.includes(seccion) ? prev.filter((s) => s !== seccion) : [...prev, seccion]
    );
  };

  const rolMenuItems: MenuItem[] = [
    {
      label: 'Superusuario',
      icon: selectedRoles.includes('superuser') ? 'pi pi-check' : '',
      command: () => toggleRole('superuser'),
    },
    {
      label: 'Director',
      icon: selectedRoles.includes('director') ? 'pi pi-check' : '',
      command: () => toggleRole('director'),
    },
    {
      label: 'Coordinador',
      icon: selectedRoles.includes('coordinador') ? 'pi pi-check' : '',
      command: () => toggleRole('coordinador'),
    },
    {
      label: 'Animador',
      icon: selectedRoles.includes('animador') ? 'pi pi-check' : '',
      command: () => toggleRole('animador'),
    },
    {
      label: 'Miembro',
      icon: selectedRoles.includes('miembro') ? 'pi pi-check' : '',
      command: () => toggleRole('miembro'),
    },
  ];

  const centroMenuItems: MenuItem[] = [
    {
      label: 'CJ Juveliber',
      icon: selectedCentros.includes('CJ Juveliber') ? 'pi pi-check' : '',
      command: () => toggleCentro('CJ Juveliber'),
      disabled: !isSuperUser,
    },
    {
      label: 'CJ La Balsa',
      icon: selectedCentros.includes('CJ La Balsa') ? 'pi pi-check' : '',
      command: () => toggleCentro('CJ La Balsa'),
      disabled: !isSuperUser,
    },
    {
      label: 'CJ Sotojoven',
      icon: selectedCentros.includes('CJ Sotojoven') ? 'pi pi-check' : '',
      command: () => toggleCentro('CJ Sotojoven'),
      disabled: !isSuperUser,
    },
  ];

  const seccionMenuItems: MenuItem[] = [
    {
      label: 'Chiqui',
      icon: selectedSecciones.includes('Chiqui') ? 'pi pi-check' : '',
      command: () => toggleSeccion('Chiqui'),
    },
    {
      label: 'CJ',
      icon: selectedSecciones.includes('CJ') ? 'pi pi-check' : '',
      command: () => toggleSeccion('CJ'),
    },
  ];

  // ========================================
  // COLUMN HEADERS CON MENÚ
  // ========================================

  const rolHeader = (
    <div className="flex align-items-center gap-2">
      <span>Rol</span>
      <Button
        icon="pi pi-filter"
        rounded
        text
        size="small"
        onClick={(e) => rolMenuRef.current?.toggle(e)}
        className={selectedRoles.length > 0 ? 'p-button-primary' : ''}
      />
      <Menu ref={rolMenuRef} model={rolMenuItems} popup />
    </div>
  );

  const centroHeader = (
    <div className="flex align-items-center gap-2">
      <span>Centro</span>
      <Button
        icon="pi pi-filter"
        rounded
        text
        size="small"
        onClick={(e) => centroMenuRef.current?.toggle(e)}
        className={selectedCentros.length > 0 ? 'p-button-primary' : ''}
      />
      <Menu ref={centroMenuRef} model={centroMenuItems} popup />
    </div>
  );

  const seccionHeader = (
    <div className="flex align-items-center gap-2">
      <span>Sección</span>
      <Button
        icon="pi pi-filter"
        rounded
        text
        size="small"
        onClick={(e) => seccionMenuRef.current?.toggle(e)}
        className={selectedSecciones.length > 0 ? 'p-button-primary' : ''}
      />
      <Menu ref={seccionMenuRef} model={seccionMenuItems} popup />
    </div>
  );

  // ========================================
  // HANDLERS
  // ========================================

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  // ========================================
  // TEMPLATES
  // ========================================

  const userTemplate = (rowData: User) => {
    const fullName = formatFullName(rowData.nombre, rowData.apellido1, rowData.apellido2);
    return (
      <div>
        <div className="font-semibold">{fullName}</div>
        <div className="text-sm text-500">{rowData.email}</div>
      </div>
    );
  };

  const rolTemplate = (rowData: User) => {
    const rolMap: any = {
      superuser: { label: 'Superusuario', severity: 'danger' },
      director: { label: 'Director', severity: 'danger' },
      coordinador: { label: 'Coordinador', severity: 'warning' },
      animador: { label: 'Animador', severity: 'success' },
      miembro: { label: 'Miembro', severity: 'info' },
    };
    const rol = rolMap[rowData.rol?.toLowerCase()] || { label: 'Usuario', severity: 'info' };
    return <Badge value={rol.label} severity={rol.severity as any} />;
  };

  const pointsTemplate = (rowData: User) => {
    return (
      <div className="flex align-items-center gap-2">
        <span className="font-bold">{rowData.puntuacion || 0}</span>
        <span className="text-500">pts</span>
      </div>
    );
  };

  const actionTemplate = (rowData: User) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        text
        onClick={() => handleUserClick(rowData)}
        tooltip="Editar usuario"
      />
    );
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="members-page p-4">
      <Toast ref={toast} />

      <div>
        <h1 className="page-title">👥 Gestión de Usuarios</h1>
        <p className="page-subtitle">Administra y visualiza todos los usuarios del sistema.</p>
      </div>

      {!isSuperUser && (
        <Message
          severity="info"
          text={`🔒 Mostrando solo usuarios de: ${userCentro}`}
          className="mb-3"
        />
      )}

      <Card>
        <DataTable
          value={filteredUsers}
          loading={loading}
          emptyMessage="No se encontraron usuarios"
          stripedRows={false}
          showGridlines={false}
        >
          <Column
            header="Usuario"
            body={userTemplate}
            sortable
            field="nombre"
            style={{ minWidth: '250px' }}
          />
          <Column
            header={rolHeader}
            body={rolTemplate}
            sortable
            field="rol"
            style={{ width: '180px' }}
          />
          <Column
            header="Puntos"
            body={pointsTemplate}
            sortable
            field="puntuacion"
            style={{ width: '100px' }}
          />
          <Column
            header={centroHeader}
            field="centro_juvenil"
            sortable
            style={{ width: '200px' }}
          />
          <Column
            header={seccionHeader}
            body={(rowData) => rowData.seccion?.join(', ') || '-'}
            style={{ width: '180px' }}
          />
          <Column header="Acciones" body={actionTemplate} style={{ width: '80px' }} />
        </DataTable>
      </Card>

      <UserEditDialog
        visible={dialogVisible}
        user={selectedUser}
        onHide={() => setDialogVisible(false)}
        onSave={fetchUsers}
        maskClassName="dialog-dark-mask"
      />
    </div>
  );
};
