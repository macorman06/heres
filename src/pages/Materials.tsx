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
import { Material } from '../types';

export const Materials: React.FC = () => {
  const { loading, getMaterials } = useApi();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const loadMaterials = async () => {
      const data = await getMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    };

    loadMaterials();
  }, []);

  useEffect(() => {
    let filtered = materials;

    if (globalFilter) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        material.category.toLowerCase().includes(globalFilter.toLowerCase()) ||
        material.uploadedBy.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(material => material.type === typeFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(material => material.category === categoryFilter);
    }

    setFilteredMaterials(filtered);
  }, [materials, globalFilter, typeFilter, categoryFilter]);

  const typeOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Documento', value: 'document' },
    { label: 'Video', value: 'video' },
    { label: 'Imagen', value: 'image' },
    { label: 'Audio', value: 'audio' },
    { label: 'Otro', value: 'other' }
  ];

  const categoryOptions = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Formación', value: 'Formación' },
    { label: 'Tutorial', value: 'Tutorial' },
    { label: 'Música', value: 'Música' },
    { label: 'Documentación', value: 'Documentación' }
  ];

  const typeBodyTemplate = (material: Material) => {
    const typeConfig = {
      document: { icon: 'pi-file-pdf', color: 'bg-red-100 text-red-800', label: 'Documento' },
      video: { icon: 'pi-video', color: 'bg-blue-100 text-blue-800', label: 'Video' },
      image: { icon: 'pi-image', color: 'bg-green-100 text-green-800', label: 'Imagen' },
      audio: { icon: 'pi-volume-up', color: 'bg-purple-100 text-purple-800', label: 'Audio' },
      other: { icon: 'pi-file', color: 'bg-gray-100 text-gray-800', label: 'Otro' }
    };

    const config = typeConfig[material.type as keyof typeof typeConfig];
    
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
          <i className={`pi ${config.icon} text-sm`} />
        </div>
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  const sizeBodyTemplate = (material: Material) => {
    return <Badge value={material.size} severity="info" />;
  };

  const downloadsBodyTemplate = (material: Material) => {
    return (
      <div className="flex items-center space-x-2">
        <i className="pi pi-download text-gray-500" />
        <span>{material.downloadCount}</span>
      </div>
    );
  };

  const actionBodyTemplate = (material: Material) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-download"
          size="small"
          outlined
          tooltip="Descargar"
          onClick={() => handleDownload(material)}
        />
        <Button
          icon="pi pi-eye"
          size="small"
          severity="info"
          tooltip="Vista previa"
          onClick={() => handlePreview(material)}
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          tooltip="Editar"
          className="bg-red-600 border-red-600"
          onClick={() => handleEdit(material)}
        />
      </div>
    );
  };

  const handleDownload = (material: Material) => {
    console.log('Descargar material:', material);
  };

  const handlePreview = (material: Material) => {
    console.log('Vista previa del material:', material);
  };

  const handleEdit = (material: Material) => {
    console.log('Editar material:', material);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando materiales..." />;
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <h2 className="text-xl font-bold text-gray-800">
        Materiales ({filteredMaterials.length})
      </h2>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar materiales..."
            className="pl-10"
          />
        </div>
        
        <Dropdown
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.value)}
          options={typeOptions}
          placeholder="Tipo"
          className="w-full sm:w-auto"
        />
        
        <Dropdown
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.value)}
          options={categoryOptions}
          placeholder="Categoría"
          className="w-full sm:w-auto"
        />
        
        <Button
          label="Subir Material"
          icon="pi pi-upload"
          className="bg-red-600 border-red-600"
        />
      </div>
    </div>
  );

  const totalDownloads = materials.reduce((sum, material) => sum + material.downloadCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Materiales', value: materials.length, color: 'bg-indigo-500', icon: 'pi-folder' },
          { label: 'Documentos', value: materials.filter(m => m.type === 'document').length, color: 'bg-red-500', icon: 'pi-file-pdf' },
          { label: 'Videos', value: materials.filter(m => m.type === 'video').length, color: 'bg-blue-500', icon: 'pi-video' },
          { label: 'Total Descargas', value: totalDownloads, color: 'bg-green-500', icon: 'pi-download' }
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className={`pi ${stat.icon} text-white text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <div className="mb-4">{header}</div>
        
        <DataTable
          value={filteredMaterials}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          emptyMessage="No se encontraron materiales"
          responsiveLayout="scroll"
        >
          <Column body={typeBodyTemplate} header="Tipo" style={{ width: '10rem' }} />
          <Column field="title" header="Título" sortable className="font-medium" />
          <Column field="category" header="Categoría" sortable />
          <Column body={sizeBodyTemplate} header="Tamaño" />
          <Column body={downloadsBodyTemplate} header="Descargas" sortable />
          <Column field="uploadedBy" header="Subido por" sortable />
          <Column 
            field="uploadDate" 
            header="Fecha de Subida" 
            sortable
            body={(material) => new Date(material.uploadDate).toLocaleDateString('es-ES')}
          />
          <Column body={actionBodyTemplate} header="Acciones" style={{ width: '10rem' }} />
        </DataTable>
      </Card>
    </div>
  );
};