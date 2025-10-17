// src/pages/juegos/PruebasPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { pruebasService } from '../../../services/api/index';
import { Prueba, PruebaFormData } from '../../../types/prueba.types';
import { PruebaEditDialog } from '../../../components/dialog/PruebaEditDialog/PruebaEditDialog';
import { PruebaCard } from '../../../components/cards/PruebaCard/PruebaCard';
import { PruebasTable } from '../../../components/tables/PruebasTable/PruebasTable';
import { FilterHeader, FilterField } from '../../../components/common/FilterHeader/FilterHeader';
import '../../../styles/4-pages/pruebas.css';

export const PruebasPage: React.FC = () => {
  const toast = useRef<Toast>(null);

  // Estados
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPrueba, setEditingPrueba] = useState<Prueba | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null);
  const [selectedEdad, setSelectedEdad] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Estado del formulario
  const [formData, setFormData] = useState<PruebaFormData>({
    nombre: '',
    descripcion: '',
    lugar: '',
    tipo: '',
    edad_recomendada_min: undefined,
    edad_recomendada_max: undefined,
    duracion_estimada: undefined,
    nivel_dificultad: '',
    materiales_necesarios: [],
    objetivos_pedagogicos: [],
    desarrollo: '',
    criterios_evaluacion: [],
    variantes: '',
    observaciones: '',
  });

  useEffect(() => {
    fetchPruebas();
  }, []);

  const fetchPruebas = async () => {
    try {
      setLoading(true);
      const data = await pruebasService.getPruebas();
      setPruebas(data.pruebas || data);
    } catch (error) {
      console.error('Error al cargar pruebas:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar las pruebas',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof PruebaFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      if (!formData.nombre || !formData.descripcion) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El nombre y la descripción son obligatorios',
          life: 3000,
        });
        return;
      }

      const result = await pruebasService.createPrueba(formData);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `Prueba "${result.prueba.nombre}" creada correctamente`,
        life: 3000,
      });

      setShowCreateDialog(false);
      resetForm();
      fetchPruebas();
    } catch (error: any) {
      console.error('Error al crear prueba:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al crear la prueba',
        life: 3000,
      });
    }
  };

  const handleEdit = async () => {
    if (!editingPrueba) return;

    try {
      await pruebasService.updatePrueba(editingPrueba.id, formData);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Prueba actualizada correctamente',
        life: 3000,
      });

      setShowEditDialog(false);
      setEditingPrueba(null);
      resetForm();
      fetchPruebas();
    } catch (error) {
      console.error('Error al actualizar prueba:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar la prueba',
        life: 3000,
      });
    }
  };

  const handleDelete = (prueba: Prueba) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar "${prueba.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await pruebasService.deletePrueba(prueba.id);
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Prueba eliminada correctamente',
            life: 3000,
          });
          fetchPruebas();
        } catch (error) {
          console.error('Error al eliminar prueba:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar la prueba',
            life: 3000,
          });
        }
      },
    });
  };

  const handleView = (prueba: Prueba) => {
    // Abrir modal de visualización detallada o navegar a página de detalle
    openEditDialog(prueba);
  };

  const openEditDialog = (prueba: Prueba) => {
    setEditingPrueba(prueba);
    setFormData({
      nombre: prueba.nombre,
      descripcion: prueba.descripcion || '',
      lugar: prueba.lugar || '',
      tipo: prueba.tipo || '',
      edad_recomendada_min: prueba.edad_recomendada_min,
      edad_recomendada_max: prueba.edad_recomendada_max,
      duracion_estimada: prueba.duracion_estimada,
      nivel_dificultad: prueba.nivel_dificultad || '',
      materiales_necesarios: prueba.materiales_necesarios || [],
      objetivos_pedagogicos: prueba.objetivos_pedagogicos || [],
      desarrollo: prueba.desarrollo || '',
      criterios_evaluacion: prueba.criterios_evaluacion || [],
      variantes: prueba.variantes || '',
      observaciones: prueba.observaciones || '',
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      lugar: '',
      tipo: '',
      edad_recomendada_min: undefined,
      edad_recomendada_max: undefined,
      duracion_estimada: undefined,
      nivel_dificultad: '',
      materiales_necesarios: [],
      objetivos_pedagogicos: [],
      desarrollo: '',
      criterios_evaluacion: [],
      variantes: '',
      observaciones: '',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTipo(null);
    setSelectedNivel(null);
    setSelectedEdad(null);
  };

  // Configuración de filtros para FilterHeader
  const filterFields: FilterField[] = [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por nombre...',
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      id: 'tipo',
      type: 'dropdown',
      placeholder: 'Tipo',
      value: selectedTipo,
      options: [
        { label: 'Todos', value: null },
        { label: 'Deporte', value: 'Deporte' },
        { label: 'Puntería', value: 'Puntería' },
        { label: 'Memoria y Lógica', value: 'Memoria y Lógica' },
        { label: 'Trivial', value: 'Trivial' },
        { label: 'Creatividad', value: 'Creatividad' },
        { label: 'Musical', value: 'Musical' },
        { label: 'Adivinanzas', value: 'Adivinanzas' },
      ],
      onChange: setSelectedTipo,
      showClear: true,
    },
    {
      id: 'nivel',
      type: 'dropdown',
      placeholder: 'Nivel',
      value: selectedNivel,
      options: [
        { label: 'Todos', value: null },
        { label: 'Bajo', value: 'Bajo' },
        { label: 'Medio', value: 'Medio' },
        { label: 'Alto', value: 'Alto' },
      ],
      onChange: setSelectedNivel,
      showClear: true,
    },
    {
      id: 'edad',
      type: 'dropdown',
      placeholder: 'Edad',
      value: selectedEdad,
      options: [
        { label: 'Todas', value: null },
        { label: '10-12 años', value: '10-12' },
        { label: '13-15 años', value: '13-15' },
        { label: '16-18 años', value: '16-18' },
      ],
      onChange: setSelectedEdad,
      showClear: true,
    },
  ];

  // Filtrar pruebas
  const filteredPruebas = pruebas.filter((p) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch = p.nombre.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    if (selectedTipo && p.tipo !== selectedTipo) return false;
    if (selectedNivel && p.nivel_dificultad !== selectedNivel) return false;

    if (selectedEdad) {
      const [minAge, maxAge] = selectedEdad.split('-').map(Number);
      const pruebaMin = p.edad_recomendada_min || 0;
      const pruebaMax = p.edad_recomendada_max || 100;
      if (pruebaMin > maxAge || pruebaMax < minAge) return false;
    }

    return true;
  });

  if (loading && pruebas.length === 0) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="pruebas-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">🎮 Pruebas y Juegos</h1>
          <p className="page-subtitle">Banco de pruebas, juegos y dinámicas para actividades.</p>
        </div>
        <Button
          label="Nueva Prueba"
          icon="pi pi-plus"
          onClick={() => setShowCreateDialog(true)}
          className="btn-primary btn-upload"
        />
      </div>

      {/* FilterHeader Component */}
      <FilterHeader
        fields={filterFields}
        onClearAll={clearFilters}
        resultsCount={filteredPruebas.length}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Visualización condicional: Grid o Lista */}
      {viewMode === 'grid' ? (
        <div className="pruebas-grid">
          {filteredPruebas.map((prueba) => (
            <PruebaCard
              key={prueba.id}
              prueba={prueba}
              onView={handleView}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <PruebasTable
          pruebas={filteredPruebas}
          onView={handleView}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      )}

      {/* Mensaje si no hay resultados */}
      {filteredPruebas.length === 0 && !loading && (
        <div className="empty-state">No se encontraron pruebas</div>
      )}

      {/* Dialogs */}
      <PruebaEditDialog
        visible={showCreateDialog}
        formData={formData}
        onHide={() => {
          setShowCreateDialog(false);
          resetForm();
        }}
        onSubmit={handleCreate}
        onChange={handleFormChange}
        isEditing={false}
      />

      <PruebaEditDialog
        visible={showEditDialog}
        formData={formData}
        onHide={() => {
          setShowEditDialog(false);
          setEditingPrueba(null);
          resetForm();
        }}
        onSubmit={handleEdit}
        onChange={handleFormChange}
        isEditing={true}
      />
    </div>
  );
};
