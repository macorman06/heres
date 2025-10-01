// src/pages/materials/grupos-formativos/SalesianosCoperadoresPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  downloads: number;
  date: string;
}

export const SalesianosCoperadoresPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Mock data - Reemplazar con datos reales del backend
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Dinámica de presentación para niños',
      description: 'Juego divertido para que los niños se conozcan al inicio del curso',
      type: 'PDF',
      tags: ['Inicio curso', 'Dinámicas', 'Grupo'],
      downloads: 45,
      date: '2024-09-15'
    },
    {
      id: '2',
      title: 'Cancionero infantil salesiano',
      description: 'Recopilación de canciones populares para niños',
      type: 'PDF',
      tags: ['Música', 'Cantos'],
      downloads: 78,
      date: '2024-08-20'
    },
    // Añadir más recursos...
  ];

  const sortOptions = [
    { label: 'Más recientes', value: 'date' },
    { label: 'Más descargados', value: 'downloads' },
    { label: 'Alfabético', value: 'title' }
  ];

  return (
    <div className="chiqui-page">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span
          className="cursor-pointer hover:text-red-600"
          onClick={() => navigate('/materiales')}
        >
          Materiales
        </span>
        <i className="pi pi-angle-right text-xs" />
        <span
          className="cursor-pointer hover:text-red-600"
          onClick={() => navigate('/materiales/grupos-formativos')}
        >
          Grupos Formativos
        </span>
        <i className="pi pi-angle-right text-xs" />
        <span className="font-semibold text-gray-800 dark:text-gray-100">Chiqui</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                <i className="pi pi-sun text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Chiqui
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {resources.length} recursos disponibles para grupos infantiles
            </p>
          </div>
          <Button
            label="Subir Nuevo"
            icon="pi pi-upload"
            className="p-button-rounded"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar recursos..."
              className="w-full"
            />
          </span>
        </div>
        <Dropdown
          value={sortBy}
          options={sortOptions}
          onChange={(e) => setSortBy(e.value)}
          placeholder="Ordenar por"
          className="w-full md:w-auto"
        />
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400
                            rounded-lg p-4 flex-shrink-0">
                <i className="pi pi-file-pdf text-3xl" />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {resource.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300
                               text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <i className="pi pi-download text-xs" />
                    {resource.downloads} descargas
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="pi pi-calendar text-xs" />
                    {new Date(resource.date).toLocaleDateString('es-ES')}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="pi pi-file text-xs" />
                    {resource.type}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  icon="pi pi-eye"
                  className="p-button-text p-button-sm"
                  tooltip="Ver detalles"
                />
                <Button
                  icon="pi pi-download"
                  className="p-button-text p-button-sm"
                  tooltip="Descargar"
                />
                <Button
                  icon="pi pi-heart"
                  className="p-button-text p-button-sm"
                  tooltip="Favorito"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
