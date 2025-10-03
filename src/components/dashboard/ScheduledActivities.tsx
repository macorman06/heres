import React, { useState, useMemo } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { CalendarEvent, FILTER_OPTIONS, FilterOption } from '../../data';
import { ActivityCard } from './ActivityCard';

interface ScheduledActivitiesProps {
  events: CalendarEvent[];
  loading?: boolean;
  onActivityAction?: (eventId: string) => void;
}

export const ScheduledActivities: React.FC<ScheduledActivitiesProps> = ({
  events,
  loading = false,
  onActivityAction,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  // Filtrar eventos según la selección
  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') {
      return events;
    }
    return events.filter((event) => event.badge === selectedFilter);
  }, [events, selectedFilter]);

  if (loading) {
    return (
      <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex">
                  <div className="flex-shrink-0 text-center mr-4">
                    <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 mb-3"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                  </div>
                  <div className="flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const handleActivityAction = (eventId: string) => {
    if (onActivityAction) {
      onActivityAction(eventId);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Chiqui':
        return 'bg-blue-100 text-blue-800';
      case 'CJ':
        return 'bg-red-100 text-red-800';
      case 'Ambas':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Actividades Programadas
          </h2>

          {/* Dropdown Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Filtrar por:
            </span>
            <Dropdown
              value={selectedFilter}
              options={FILTER_OPTIONS}
              onChange={(e) => setSelectedFilter(e.value)}
              placeholder="Seleccionar filtro"
              className="w-48"
              panelClassName="shadow-lg"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {filteredEvents.length === events.length
              ? `Mostrando todas las actividades (${filteredEvents.length})`
              : `Mostrando ${filteredEvents.length} de ${events.length} actividades`}
          </div>

          {/* Leyenda de badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Leyenda:</span>
            <span className={`px-2 py-1 rounded-full ${getBadgeColor('Chiqui')}`}>Chiqui</span>
            <span className={`px-2 py-1 rounded-full ${getBadgeColor('CJ')}`}>CJ</span>
            <span className={`px-2 py-1 rounded-full ${getBadgeColor('Ambas')}`}>Ambas</span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <i className="pi pi-calendar text-4xl mb-4 block"></i>
              <p className="text-lg mb-2">No hay actividades programadas</p>
              <p className="text-sm">
                {selectedFilter === 'all'
                  ? 'No se encontraron actividades en el sistema.'
                  : `No se encontraron actividades para "${FILTER_OPTIONS.find((opt) => opt.value === selectedFilter)?.label}".`}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <ActivityCard key={event.id} event={event} onMoreOptions={handleActivityAction} />
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
