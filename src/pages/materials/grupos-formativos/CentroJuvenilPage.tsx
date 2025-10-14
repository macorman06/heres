// src/pages/materials/grupos-formativos/CentroJuvenilPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { materialsService } from '../../../services/api/index';
import { Material, MaterialFormData } from '../../../types/material.types';
import { MaterialEditDialog } from '../../../components/dialog/MaterialEditDialog/MaterialEditDialog';
import { GrupodefeCard } from '../../../components/cards/GrupodefeCard';
import '../../../styles/4-pages/materials/centrojuvenil.css';

export const CentroJuvenilPage: React.FC = () => {
  const toast = useRef<Toast>(null);

  // Estados
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState('');
  const [sortBy] = useState('fecha_subida');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

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

  // Cargar materiales al montar el componente
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
      if (!formData.titulo) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El título es obligatorio',
          life: 3000,
        });
        return;
      }

      if (!formData.file) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Debes seleccionar un archivo',
          life: 3000,
        });
        return;
      }

      // Subir con archivo a R2
      const result = await materialsService.uploadMaterial(formData);

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
      // Obtener URL firmada del backend
      const downloadData = await materialsService.downloadMaterial(material.id);

      // Abrir en nueva pestaña
      window.open(downloadData.download_url, '_blank');

      toast.current?.show({
        severity: 'success',
        summary: 'Descargando',
        detail: `${downloadData.filename} (${downloadData.size_mb} MB)`,
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

  // Filtrar y ordenar materiales
  const filteredAndSortedMaterials = [...materiales]
    .filter((m) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        m.titulo.toLowerCase().includes(search) ||
        m.descripcion?.toLowerCase().includes(search) ||
        m.etiquetas?.some((tag) => tag.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'titulo') {
        return a.titulo.localeCompare(b.titulo);
      } else {
        return new Date(b.fecha_subida).getTime() - new Date(a.fecha_subida).getTime();
      }
    });

  if (loading && materiales.length === 0) {
    return (
      <div className="loading-container">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="centro-juvenil-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>📄 Centro Juvenil</h1>
          <p>Grupos de fe de Centro Juvenil.</p>
        </div>
        <Button
          label="Subir Material"
          icon="pi pi-upload"
          onClick={() => setShowUploadDialog(true)}
          className="btn-primary"
        />
      </div>

      {/* Listado de materiales */}
      <div className="materials-grid">
        {filteredAndSortedMaterials.map((material) => (
          <GrupodefeCard
            key={material.id}
            material={material}
            onDownload={handleDownload}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredAndSortedMaterials.length === 0 && !loading && (
        <div className="empty-state">
          <i className="pi pi-inbox"></i>
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
