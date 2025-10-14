// src/pages/materials/grupos-formativos/CentroJuvenilPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { materialsService } from '../../../services/api/index';
import { Material, MaterialFormData } from '../../../types/material.types';
import { MaterialEditDialog } from '../../../components/dialog/MaterialEditDialog/MaterialEditDialog';
import { GrupodefeCard } from '../../../components/cards/GrupodefeCard/GrupodefeCard.tsx';
import { MaterialsTable } from '../../../components/tables/MaterialsTable/MaterialsTable';
import { FilterHeader, FilterField } from '../../../components/common/FilterHeader/FilterHeader';
import '../../../styles/4-pages/materials/centrojuvenil.css';
import { useAuth } from '../../../hooks/useAuth';

export const CentroJuvenilPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { user: currentUser } = useAuth();

  // Estados
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState<string | null>(null);
  const [selectedIEF, setSelectedIEF] = useState<boolean | null>(null);
  const [selectedFecha, setSelectedFecha] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Estado del formulario
  const [formData, setFormData] = useState<MaterialFormData>({
    titulo: '',
    descripcion: '',
    tipo: 'PDF',
    grupo: '',
    seccion: 'CJ',
    categoria: 'formación',
    etiquetas: [],
    visible_para_grupos: [],
    file: undefined,
  });

  useEffect(() => {
    fetchMateriales();
  }, []);

  const fetchMateriales = async () => {
    try {
      setLoading(true);
      const data = await materialsService.getMateriales({
        seccion: 'CJ',
        limit: 100,
      });
      setMateriales(data);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los materiales',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof MaterialFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    try {
      if (!formData.titulo || !formData.file) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El título y el archivo son obligatorios',
          life: 3000,
        });
        return;
      }

      if (!currentUser?.id) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario no autenticado',
          life: 3000,
        });
        return;
      }

      const result = await materialsService.uploadMaterial(formData, currentUser.id);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `Material "${result.titulo}" subido correctamente`,
        life: 3000,
      });

      setShowUploadDialog(false);
      resetForm();
      fetchMateriales();
    } catch (error: any) {
      console.error('Error al subir material:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al subir el material',
        life: 3000,
      });
    }
  };

  const handleDownload = async (material: Material) => {
    try {
      const downloadData = await materialsService.downloadMaterial(material.id);
      window.open(downloadData.download_url, '_blank');

      toast.current?.show({
        severity: 'success',
        summary: 'Descargando',
        detail: `${downloadData.filename}`,
        life: 3000,
      });
    } catch (error: any) {
      console.error('Error al descargar material:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Error al descargar el archivo',
        life: 3000,
      });
    }
  };

  const handleEdit = async () => {
    if (!editingMaterial) return;

    try {
      await materialsService.updateMaterial(editingMaterial.id, formData);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Material actualizado correctamente',
        life: 3000,
      });

      setShowEditDialog(false);
      setEditingMaterial(null);
      resetForm();
      fetchMateriales();
    } catch (error) {
      console.error('Error al actualizar material:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el material',
        life: 3000,
      });
    }
  };

  const handleDelete = (material: Material) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar "${material.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await materialsService.deleteMaterial(material.id);

          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Material eliminado correctamente',
            life: 3000,
          });

          fetchMateriales();
        } catch (error) {
          console.error('Error al eliminar material:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el material',
            life: 3000,
          });
        }
      },
    });
  };

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      titulo: material.titulo,
      descripcion: material.descripcion || '',
      tipo: material.tipo || 'PDF',
      grupo: material.grupo || '',
      seccion: material.seccion || 'CJ',
      categoria: material.categoria || 'formación',
      etiquetas: material.etiquetas || [],
      visible_para_grupos: material.visible_para_grupos || [],
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'PDF',
      grupo: '',
      seccion: 'CJ',
      categoria: 'formación',
      etiquetas: [],
      visible_para_grupos: [],
      file: undefined,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGrupo(null);
    setSelectedIEF(null);
    setSelectedFecha(null);
  };

  // Configuración de filtros para FilterHeader
  const filterFields: FilterField[] = [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por etiquetas...',
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      id: 'ief',
      type: 'selectButton',
      value: selectedIEF,
      options: [
        { label: 'Todos', value: null },
        { label: 'Solo IEF', value: true },
        { label: 'Sin IEF', value: false },
      ],
      onChange: setSelectedIEF,
    },
    {
      id: 'grupo',
      type: 'dropdown',
      placeholder: 'Grupo',
      value: selectedGrupo,
      options: [
        { label: 'Todos', value: null },
        { label: 'J1', value: 'J1' },
        { label: 'J2', value: 'J2' },
        { label: 'J3', value: 'J3' },
        { label: 'Animadores', value: 'Animadores' },
      ],
      onChange: setSelectedGrupo,
      showClear: true,
    },
    {
      id: 'fecha',
      type: 'dropdown',
      placeholder: 'Fecha',
      value: selectedFecha,
      options: [
        { label: 'Todas', value: null },
        { label: 'Última semana', value: '7days' },
        { label: 'Último mes', value: '30days' },
        { label: 'Último año', value: '365days' },
      ],
      onChange: setSelectedFecha,
      showClear: true,
    },
  ];

  // Filtrar materiales
  const filteredMaterials = materiales.filter((m) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch = m.etiquetas?.some((tag) => tag.toLowerCase().includes(search));
      if (!matchesSearch) return false;
    }

    if (selectedGrupo && m.grupo !== selectedGrupo) return false;

    if (selectedIEF !== null) {
      const hasIEF = m.etiquetas?.some((tag) => tag.toLowerCase() === 'ief');
      if (selectedIEF && !hasIEF) return false;
      if (!selectedIEF && hasIEF) return false;
    }

    if (selectedFecha) {
      const now = new Date();
      const materialDate = new Date(m.fecha_subida);
      const daysDiff = Math.floor((now.getTime() - materialDate.getTime()) / (1000 * 60 * 60 * 24));

      if (selectedFecha === '7days' && daysDiff > 7) return false;
      if (selectedFecha === '30days' && daysDiff > 30) return false;
      if (selectedFecha === '365days' && daysDiff > 365) return false;
    }

    return true;
  });

  if (loading && materiales.length === 0) {
    return (
      <div className="loading-container">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="centrojuvenil-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="page-header">
        <div className="header-text">
          <h1>📄 Centro Juvenil</h1>
          <p className="header-subtitle">Grupos de fe de Centro Juvenil.</p>
        </div>
        <Button
          label="Subir Material"
          icon="pi pi-upload"
          onClick={() => setShowUploadDialog(true)}
          className="btn-primary btn-upload"
        />
      </div>

      {/* FilterHeader Component */}
      <FilterHeader
        fields={filterFields}
        onClearAll={clearFilters}
        resultsCount={filteredMaterials.length}
        resultsLabel={filteredMaterials.length === 1 ? 'material' : 'materiales'}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Visualización condicional: Grid o Lista */}
      {viewMode === 'grid' ? (
        <div className="materials-grid">
          {filteredMaterials.map((material) => (
            <GrupodefeCard
              key={material.id}
              material={material}
              onDownload={handleDownload}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <MaterialsTable
          materials={filteredMaterials}
          onDownload={handleDownload}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      )}

      {/* Mensaje si no hay resultados */}
      {filteredMaterials.length === 0 && !loading && (
        <div className="empty-state">
          <i className="pi pi-inbox" />
          <p>No se encontraron materiales</p>
        </div>
      )}

      {/* Dialogs */}
      <MaterialEditDialog
        visible={showUploadDialog}
        formData={formData}
        onHide={() => {
          setShowUploadDialog(false);
          resetForm();
        }}
        onSubmit={handleUpload}
        onChange={handleFormChange}
        isEditing={false}
      />

      <MaterialEditDialog
        visible={showEditDialog}
        formData={formData}
        onHide={() => {
          setShowEditDialog(false);
          setEditingMaterial(null);
          resetForm();
        }}
        onSubmit={handleEdit}
        onChange={handleFormChange}
        isEditing={true}
      />
    </div>
  );
};
