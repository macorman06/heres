// src/pages/materials/grupos-formativos/TipografiaPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

interface SubCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  route: string;
}

export const TipografiaPage: React.FC = () => {
  const navigate = useNavigate();

  const subCategories: SubCategory[] = [
    {
      id: 'chiqui',
      title: 'Chiqui',
      description: 'Materiales para grupos infantiles',
      icon: 'pi-sun',
      count: 24,
      route: '/materiales/grupos-formativos/chiqui'
    },
    {
      id: 'centro-juvenil',
      title: 'Centro Juvenil',
      description: 'Recursos para adolescentes y jóvenes',
      icon: 'pi-users',
      count: 18,
      route: '/materiales/grupos-formativos/centro-juvenil'
    },
    {
      id: 'catecumenado',
      title: 'Catecumenado',
      description: 'Materiales de formación en la fe',
      icon: 'pi-book',
      count: 15,
      route: '/materiales/grupos-formativos/catecumenado'
    },
    {
      id: 'salesianos-cooperadores',
      title: 'Salesianos Cooperadores',
      description: 'Recursos para cooperadores salesianos',
      icon: 'pi-sitemap',
      count: 8,
      route: '/materiales/grupos-formativos/salesianos-cooperadores'
    },
    {
      id: 'comunidades',
      title: 'Comunidades',
      description: 'Materiales para comunidades de base',
      icon: 'pi-heart',
      count: 12,
      route: '/materiales/grupos-formativos/comunidades'
    },
    {
      id: 'otros',
      title: 'Otros',
      description: 'Otros grupos formativos',
      icon: 'pi-folder',
      count: 5,
      route: '/materiales/grupos-formativos/otros'
    }
  ];

  return (
    <div className="grupos-formativos-page">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          label="Volver a Materiales"
          icon="pi pi-arrow-left"
          className="p-button-text"
          onClick={() => navigate('/materiales')}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <i className="pi pi-users text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Grupos Formativos
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Recursos organizados por tipo de grupo formativo
        </p>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((sub) => (
          <Card
            key={sub.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(sub.route)}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400
                            rounded-lg p-4 flex-shrink-0">
                <i className={`pi ${sub.icon} text-2xl`} />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {sub.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {sub.description}
                </p>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                               text-xs px-2 py-1 rounded-full">
                  {sub.count} recursos
                </span>
              </div>

              {/* Arrow */}
              <i className="pi pi-chevron-right text-gray-400 self-center" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
