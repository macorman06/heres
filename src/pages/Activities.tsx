import React, { useState, useEffect } from 'react';
import { ActivityCard } from '../components/cards/ActivityCard/ActivityCard';
import { ActivityFormDialog } from '../components/dialog/ActivityFormDialog/ActivityFormDialog';
import { actividadesService } from '../services/api/index';
import type { Actividad } from '../services/api/index';
import { Button } from 'primereact/button';

export const Activities: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState<'cards' | 'calendario'>('cards');
  const [filtros, setFiltros] = useState({
    solo_principales: true,
    incluir_subactividades: false,
    incluir_tareas: false,
  });

  // Estados de filtros
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anoSeleccionado, setAnoSeleccionado] = useState(new Date().getFullYear());
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // ✅ Estados para el diálogo de creación/edición
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [actividadEditar, setActividadEditar] = useState<Actividad | null>(null);

  // Cargar actividades
  useEffect(() => {
    cargarActividades();
  }, [filtros, vistaActual, mesSeleccionado, anoSeleccionado]);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      let data: Actividad[];

      if (vistaActual === 'calendario') {
        data = await actividadesService.obtenerCalendario(mesSeleccionado, anoSeleccionado);
      } else {
        const filtrosActualizados = {
          ...filtros,
          tipo: tipoSeleccionado || undefined,
          seccion: seccionSeleccionada || undefined,
        };
        data = await actividadesService.listar(filtrosActualizados);
      }

      setActividades(data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    cargarActividades();
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setTipoSeleccionado('');
    setSeccionSeleccionada('');
    setFiltros({
      solo_principales: true,
      incluir_subactividades: false,
      incluir_tareas: false,
    });
  };

  const cambiarMes = (direccion: 'prev' | 'next') => {
    if (direccion === 'prev') {
      if (mesSeleccionado === 1) {
        setMesSeleccionado(12);
        setAnoSeleccionado(anoSeleccionado - 1);
      } else {
        setMesSeleccionado(mesSeleccionado - 1);
      }
    } else {
      if (mesSeleccionado === 12) {
        setMesSeleccionado(1);
        setAnoSeleccionado(anoSeleccionado + 1);
      } else {
        setMesSeleccionado(mesSeleccionado + 1);
      }
    }
  };

  // ✅ Handler para abrir el diálogo de nueva actividad
  const handleCreateActividad = () => {
    setActividadEditar(null);
    setShowFormDialog(true);
  };

  // ✅ Handler para cerrar el diálogo
  const handleCloseFormDialog = () => {
    setShowFormDialog(false);
    setActividadEditar(null);
  };

  // ✅ Handler cuando se guarda exitosamente una actividad
  const handleSuccessForm = () => {
    cargarActividades();
    handleCloseFormDialog();
  };

  const handleExportarCalendario = () => {
    // TODO: Exportar calendario
    console.log('Exportar calendario');
  };

  const nombreMes = new Date(anoSeleccionado, mesSeleccionado - 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Actividades</h1>
          <p className="text-gray-600">Gestiona las actividades del Centro Juvenil</p>
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            {/* Botón Filtros */}
            <Button
              label="Filtros"
              icon="pi pi-filter"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="p-button-outlined"
              severity="secondary"
            />

            {/* Toggle Vista */}
            <Button
              icon="pi pi-th-large"
              onClick={() => setVistaActual('cards')}
              className={vistaActual === 'cards' ? 'p-button-primary' : 'p-button-outlined'}
              tooltip="Vista en tarjetas"
              tooltipOptions={{ position: 'bottom' }}
            />
            <Button
              icon="pi pi-calendar"
              onClick={() => setVistaActual('calendario')}
              className={vistaActual === 'calendario' ? 'p-button-primary' : 'p-button-outlined'}
              tooltip="Vista calendario"
              tooltipOptions={{ position: 'bottom' }}
            />

            {/* Botón Exportar (solo en vista calendario) */}
            {vistaActual === 'calendario' && (
              <Button
                label="Exportar"
                icon="pi pi-download"
                onClick={handleExportarCalendario}
                className="btn-secondary"
              />
            )}
          </div>

          {/* Botón Nueva Actividad */}
          <Button
            label="Nueva Actividad"
            icon="pi pi-plus"
            onClick={handleCreateActividad}
            className="btn-primary"
          />
        </div>

        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tipo de actividad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Actividad
                </label>
                <select
                  value={tipoSeleccionado}
                  onChange={(e) => setTipoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="Programación">Programación</option>
                  <option value="Oración">Oración</option>
                  <option value="Comisión">Comisión</option>
                  <option value="Actividad normal">Actividad normal</option>
                  <option value="Reunión">Reunión</option>
                  <option value="Formación">Formación</option>
                </select>
              </div>

              {/* Sección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sección</label>
                <select
                  value={seccionSeleccionada}
                  onChange={(e) => setSeccionSeleccionada(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  <option value="CJ">CJ</option>
                  <option value="Chiqui">Chiqui</option>
                  <option value="Ambas">Ambas</option>
                </select>
              </div>

              {/* Opciones adicionales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.incluir_subactividades}
                      onChange={(e) =>
                        setFiltros({ ...filtros, incluir_subactividades: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Incluir subactividades</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.incluir_tareas}
                      onChange={(e) => setFiltros({ ...filtros, incluir_tareas: e.target.checked })}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Incluir tareas</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              <Button
                label="Limpiar"
                icon="pi pi-times"
                onClick={limpiarFiltros}
                className="p-button-text"
              />
              <Button label="Aplicar Filtros" icon="pi pi-check" onClick={aplicarFiltros} />
            </div>
          </div>
        )}

        {/* Navegación de calendario */}
        {vistaActual === 'calendario' && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
            <button
              onClick={() => cambiarMes('prev')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Anterior
            </button>
            <h2 className="text-xl font-semibold text-gray-900 capitalize">{nombreMes}</h2>
            <button
              onClick={() => cambiarMes('next')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Contenido principal */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando actividades...</p>
            </div>
          ) : actividades.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-500 mb-2">No hay actividades</p>
              <p className="text-sm text-gray-400">
                {vistaActual === 'calendario'
                  ? `No hay actividades programadas para ${nombreMes}`
                  : 'No se encontraron actividades con los filtros aplicados'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actividades.map((actividad) => (
                <ActivityCard
                  key={actividad.id}
                  actividad={actividad}
                  onUpdate={cargarActividades}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Diálogo de Formulario de Actividad */}
      <ActivityFormDialog
        visible={showFormDialog}
        actividad={actividadEditar}
        onHide={handleCloseFormDialog}
        onSuccess={handleSuccessForm}
      />
    </div>
  );
};
