// src/pages/Tasks.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Checkbox } from 'primereact/checkbox';
import { CheckSquare } from 'lucide-react';
import { tareasService } from '../services/api/index';
import type { Tarea } from '../services/api/services/tareasService';

export const Tasks: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedTareas, setSelectedTareas] = useState<Tarea[]>([]);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [mostrarSoloMias, setMostrarSoloMias] = useState(true);

  // Usuario actual
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    cargarTareas();
  }, [mostrarSoloMias, filtroEstado, filtroPrioridad]);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      let data: Tarea[];

      if (mostrarSoloMias) {
        // Usar endpoint de "mis tareas"
        data = await tareasService.obtenerMisTareas({
          estado: filtroEstado || undefined,
          prioridad: filtroPrioridad || undefined,
        });
      } else {
        // Usar endpoint de listar todas
        data = await tareasService.listar({
          estado: filtroEstado || undefined,
          prioridad: filtroPrioridad || undefined,
        });
      }

      setTareas(data || []);
    } catch (error) {
      console.error('Error cargando tareas:', error);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Templates de columnas ====================
  const estadoBodyTemplate = (rowData: Tarea) => {
    const estadoMap = {
      'Por hacer': { severity: 'info', label: 'Por hacer' },
      'En proceso': { severity: 'warning', label: 'En proceso' },
      Terminada: { severity: 'success', label: 'Terminada' },
      Bloqueada: { severity: 'danger', label: 'Bloqueada' },
    };
    const config = estadoMap[rowData.estado] || { severity: 'info', label: rowData.estado };
    return <Tag value={config.label} severity={config.severity as any} />;
  };

  const prioridadBodyTemplate = (rowData: Tarea) => {
    const prioridadMap = {
      Crítica: { severity: 'danger', label: 'Crítica' },
      Alta: { severity: 'warning', label: 'Alta' },
      Media: { severity: 'info', label: 'Media' },
      Baja: { severity: 'success', label: 'Baja' },
    };
    const config = prioridadMap[rowData.prioridad] || { severity: 'info', label: 'Media' };
    return <Tag value={config.label} severity={config.severity as any} />;
  };

  const fechaBodyTemplate = (rowData: Tarea) => {
    if (!rowData.fecha_vencimiento) return '-';
    const fecha = new Date(rowData.fecha_vencimiento);
    const hoy = new Date();
    const esVencida = fecha < hoy && rowData.estado !== 'Terminada';

    return (
      <span className={esVencida ? 'text-red-600 font-semibold' : ''}>
        {fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
        {esVencida && ' ⚠️'}
      </span>
    );
  };

  const asignadosBodyTemplate = (rowData: Tarea) => {
    const cantidad = rowData.usuarios_asignados_ids?.length || 0;
    return <Tag value={`${cantidad} persona${cantidad !== 1 ? 's' : ''}`} severity="info" />;
  };

  const accionesBodyTemplate = (rowData: Tarea) => {
    return (
      <div className="flex gap-2">
        {rowData.estado !== 'Terminada' && (
          <Button
            icon="pi pi-check"
            rounded
            text
            severity="success"
            tooltip="Marcar como terminada"
            tooltipOptions={{ position: 'top' }}
            onClick={() => handleCambiarEstado(rowData, 'Terminada')}
          />
        )}
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="info"
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          tooltip="Eliminar"
          tooltipOptions={{ position: 'top' }}
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  // ==================== Handlers ====================
  const handleCambiarEstado = async (
    tarea: Tarea,
    nuevoEstado: 'Por hacer' | 'En proceso' | 'Terminada' | 'Bloqueada'
  ) => {
    try {
      await tareasService.cambiarEstado(tarea.id, nuevoEstado);
      cargarTareas();
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const handleEdit = (tarea: Tarea) => {
    // TODO: Abrir diálogo de edición
    console.log('Editar tarea:', tarea);
  };

  const handleDelete = async (tarea: Tarea) => {
    if (confirm(`¿Eliminar la tarea "${tarea.nombre}"?`)) {
      try {
        await tareasService.eliminar(tarea.id);
        cargarTareas();
      } catch (error) {
        console.error('Error eliminando tarea:', error);
      }
    }
  };

  const handleNuevaTarea = () => {
    // TODO: Abrir diálogo de nueva tarea
    console.log('Nueva tarea');
  };

  // ==================== Opciones de filtros ====================
  const estadoOptions = [
    { label: 'Todas', value: '' },
    { label: 'Por hacer', value: 'Por hacer' },
    { label: 'En proceso', value: 'En proceso' },
    { label: 'Terminada', value: 'Terminada' },
    { label: 'Bloqueada', value: 'Bloqueada' },
  ];

  const prioridadOptions = [
    { label: 'Todas', value: '' },
    { label: 'Crítica', value: 'Crítica' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de página */}
        <div className="page-header mb-6">
          <div className="header-text">
            <h1>✅ Mis tareas</h1>
            <p className="header-subtitle">
              Tareas y responsabilidades pendientes. {tareas.length} tarea
              {tareas.length !== 1 ? 's' : ''} en total.
            </p>
          </div>
          <div className="header-actions">
            <Button
              label="Nueva Tarea"
              icon="pi pi-plus"
              onClick={handleNuevaTarea}
              className="btn-primary"
            />
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 align-items-center">
            {/* Buscador global */}
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full md:w-20rem"
              />
            </span>

            {/* Filtro de estado */}
            <Dropdown
              value={filtroEstado}
              options={estadoOptions}
              onChange={(e) => setFiltroEstado(e.value)}
              placeholder="Estado"
              className="w-12rem"
            />

            {/* Filtro de prioridad */}
            <Dropdown
              value={filtroPrioridad}
              options={prioridadOptions}
              onChange={(e) => setFiltroPrioridad(e.value)}
              placeholder="Prioridad"
              className="w-12rem"
            />

            {/* Toggle "Solo mis tareas" */}
            <div className="flex align-items-center gap-2 p-3 border-1 border-round surface-border">
              <Checkbox
                inputId="soloMias"
                checked={mostrarSoloMias}
                onChange={(e) => setMostrarSoloMias(e.checked || false)}
              />
              <label htmlFor="soloMias" className="cursor-pointer">
                Solo mis tareas
              </label>
            </div>

            {/* Botón limpiar filtros */}
            {(globalFilter || filtroEstado || filtroPrioridad) && (
              <Button
                label="Limpiar filtros"
                icon="pi pi-filter-slash"
                className="p-button-text"
                onClick={() => {
                  setGlobalFilter('');
                  setFiltroEstado('');
                  setFiltroPrioridad('');
                }}
              />
            )}
          </div>
        </div>

        {/* Tabla de tareas */}
        <div className="card">
          <DataTable
            value={tareas}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            dataKey="id"
            selection={selectedTareas}
            onSelectionChange={(e) => setSelectedTareas(e.value)}
            globalFilter={globalFilter}
            emptyMessage="No se encontraron tareas"
            className="p-datatable-striped"
            responsiveLayout="scroll"
            sortField="fecha_vencimiento"
            sortOrder={1}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="nombre" header="Nombre" sortable style={{ minWidth: '200px' }} />
            <Column
              field="estado"
              header="Estado"
              body={estadoBodyTemplate}
              sortable
              style={{ minWidth: '120px' }}
            />
            <Column
              field="prioridad"
              header="Prioridad"
              body={prioridadBodyTemplate}
              sortable
              style={{ minWidth: '120px' }}
            />
            <Column
              field="fecha_vencimiento"
              header="Vencimiento"
              body={fechaBodyTemplate}
              sortable
              style={{ minWidth: '130px' }}
            />
            <Column
              field="usuarios_asignados_ids"
              header="Asignados"
              body={asignadosBodyTemplate}
              style={{ minWidth: '120px' }}
            />
            <Column
              header="Acciones"
              body={accionesBodyTemplate}
              exportable={false}
              style={{ minWidth: '150px' }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
