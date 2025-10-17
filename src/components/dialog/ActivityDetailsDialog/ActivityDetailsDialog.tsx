// src/components/dialogs/ActivityDetailsDialog.tsx
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar, MapPin, Users, CheckSquare, List } from 'lucide-react';
import { Actividad } from '../../../services/api/index';
import { UserAvatar } from '../../common/UserAvatar';

interface ActivityDetailsDialogProps {
  visible: boolean;
  actividad: Actividad | null;
  onHide: () => void;
}

export const ActivityDetailsDialog: React.FC<ActivityDetailsDialogProps> = ({
  visible,
  actividad,
  onHide,
}) => {
  if (!actividad) return null;

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={actividad.nombre}
      style={{ width: '50vw' }}
      modal
      maskClassName="dialog-dark-mask"
    >
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {actividad.tipo_actividad}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {actividad.seccion}
        </span>
        {actividad.es_recurrente && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            🔄 Recurrente
          </span>
        )}
      </div>

      {/* Descripción */}
      {actividad.descripcion && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Descripción</h3>
          <p className="text-gray-700">{actividad.descripcion}</p>
        </div>
      )}

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <p className="font-semibold text-sm text-gray-500">Inicio</p>
            <p className="text-gray-900">{formatearFecha(actividad.fecha_inicio)}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <p className="font-semibold text-sm text-gray-500">Fin</p>
            <p className="text-gray-900">{formatearFecha(actividad.fecha_fin)}</p>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="flex items-start gap-2 mb-4">
        <MapPin className="w-5 h-5 text-gray-500 mt-1" />
        <div>
          <p className="font-semibold text-sm text-gray-500">Ubicación</p>
          <p className="text-gray-900">{actividad.ubicacion}</p>
        </div>
      </div>

      {/* Responsable */}
      {actividad.responsable && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <UserAvatar userId={actividad.responsable.id} size="md" />
            <span className="font-medium">Responsable:</span>
            <span>{actividad.responsable.nombre}</span>
          </div>
        </div>
      )}

      {/* Tareas Asignadas */}
      {actividad.tareas && actividad.tareas.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Tareas ({actividad.tareas.length})</h3>
          </div>
          <ul className="space-y-2">
            {actividad.tareas.map((tarea, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-600 mt-1">•</span>
                <div className="flex-1">
                  <span className="font-medium">{tarea.titulo || tarea.nombre}</span>
                  {tarea.completada !== undefined && (
                    <span
                      className={`ml-2 text-xs ${tarea.completada ? 'text-green-600' : 'text-orange-600'}`}
                    >
                      {tarea.completada ? '✓ Completada' : '○ Pendiente'}
                    </span>
                  )}
                  {tarea.asignado_a && (
                    <div className="text-sm text-gray-600 mt-1">
                      Asignada a: {tarea.asignado_a.nombre || tarea.asignado_a}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subactividades */}
      {actividad.subactividades && actividad.subactividades.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <List className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">
              Subactividades ({actividad.subactividades.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {actividad.subactividades.map((subactividad, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-purple-600 mt-1">•</span>
                <div className="flex-1">
                  <span className="font-medium">{subactividad.nombre || subactividad.titulo}</span>
                  {subactividad.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{subactividad.descripcion}</p>
                  )}
                  {subactividad.hora && (
                    <span className="text-xs text-gray-500 mt-1 block">🕐 {subactividad.hora}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personas con esta actividad */}
      {actividad.participantes_ids && actividad.participantes_ids.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">
              Personas ({actividad.participantes_ids.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {actividad.participantes_ids.map((id) => (
              <UserAvatar key={id} userId={id} size="medium" />
            ))}
          </div>
        </div>
      )}

      {/* Animadores */}
      {actividad.animadores_ids && actividad.animadores_ids.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold">Animadores ({actividad.animadores_ids.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {actividad.animadores_ids.map((id) => (
              <UserAvatar key={id} userId={id} size="medium" />
            ))}
          </div>
        </div>
      )}
    </Dialog>
  );
};
