// src/pages/Materials.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';

interface CategoryCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  count: number;
  route: string;
}

export const Materials: React.FC = () => {
  const navigate = useNavigate();

  const categories: CategoryCard[] = [
    {
      id: 'grupos-formativos',
      title: 'Grupos Formativos',
      icon: 'pi-users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      count: 6,
      route: '/materiales/grupos-formativos'
    },
    {
      id: 'talleres',
      title: 'Talleres',
      icon: 'pi-palette',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      count: 3,
      route: '/materiales/talleres'
    },
    {
      id: 'juegos',
      title: 'Juegos',
      icon: 'pi-star',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      count: 4,
      route: '/materiales/juegos'
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      icon: 'pi-trophy',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      count: 2,
      route: '/materiales/pruebas'
    },
    {
      id: 'oraciones',
      title: 'Oraciones',
      icon: 'pi-heart',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      count: 3,
      route: '/materiales/oraciones'
    },
    {
      id: 'campana-pastoral',
      title: 'Campaña Pastoral',
      icon: 'pi-bookmark',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      count: 3,
      route: '/materiales/campana-pastoral'
    },
    {
      id: 'imagen-corporativa',
      title: 'Imagen Corporativa',
      icon: 'pi-image',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      count: 3,
      route: '/materiales/imagen-corporativa'
    }
  ];

  return (
    <div className="materials-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Materiales y Recursos
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explora y organiza todos los recursos del centro juvenil
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <i className="pi pi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar materiales, juegos, oraciones..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate(category.route)}
          >
            <div className="flex flex-col items-center text-center p-4">
              {/* Icon */}
              <div className={`${category.bgColor} ${category.color} rounded-full p-6 mb-4`}>
                <i className={`pi ${category.icon} text-4xl`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {category.title}
              </h3>

              {/* Count Badge */}
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                             text-sm px-3 py-1 rounded-full">
                {category.count} categorías
              </span>

              {/* Arrow */}
              <i className="pi pi-arrow-right text-gray-400 mt-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
