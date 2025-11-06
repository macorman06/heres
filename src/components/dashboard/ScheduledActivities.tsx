// src/components/dashboard/ScheduledActivities.tsx

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ActivityCard } from '../cards/ActivityCard/ActivityCard';
import { actividadesService } from '../../services/api/index';
import type { Actividad } from '../../services/api/index';

// ✅ SIN PROPS - El componente carga sus propias actividades
export const ScheduledActivities: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActividades = async () => {
    try {
      setLoading(true);
      const data = await actividadesService.listar();
      // Filtrar solo próximas actividades (futuras)
      const ahora = new Date();
      const proximasActividades = data
        .filter((act: Actividad) => new Date(act.fecha_inicio) >= ahora)
        .sort(
          (a: Actividad, b: Actividad) =>
            new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime()
        )
        .slice(0, 5); // Solo las 5 próximas

      setActividades(proximasActividades);
    } catch (err) {
      setError('Error al cargar las actividades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  return (
    <Card className="shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Próximas Actividades</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {actividades.length}
          </span>
        </div>

        {loading && (
          <div className="text-center py-8">
            <i className="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
            <p className="text-gray-500 mt-2">Cargando actividades...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <i className="pi pi-exclamation-triangle"></i>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && actividades.length === 0 && (
          <div className="text-center py-12">
            <i className="pi pi-calendar text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">No hay actividades programadas</p>
          </div>
        )}

        {!loading && !error && actividades.length > 0 && (
          <div className="space-y-3">
            {actividades
              .filter((actividad) => actividad != null)
              .map((actividad) => (
                <ActivityCard
                  key={actividad.id}
                  actividad={actividad}
                  onUpdate={fetchActividades}
                />
              ))}
          </div>
        )}

        {!loading && !error && actividades.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <a
              href="/activities"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Ver todas las actividades
              <i className="pi pi-arrow-right text-xs"></i>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
