// src/components/cards/ActivityCard/ActivityCard.tsx

import React, { useState } from 'react';
import { Calendar, MapPin, Users, MoreVertical } from 'lucide-react';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Actividad } from '../../../services/api/index';
import { UserAvatar } from '../../common/UserAvatar';
import { ActivityDetailsDialog } from '../../dialog/ActivityDetailsDialog/ActivityDetailsDialog';
import { ActivityFormDialog } from '../../dialog/ActivityFormDialog/ActivityFormDialog';
import { DeleteConfirmDialog } from '../../dialog/DeleteConfirmDialog/DeleteConfirmDialog';
import { CreateTaskDialog } from '../../dialog/CreateTaskDialog/CreateTaskDialog';
import { AddInvoiceDialog } from '../../dialog/AddInvoiceDialog/AddInvoiceDialog';
import './ActivityCard.css';

interface ActivityCardProps {
  actividad: Actividad;
  onUpdate?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ actividad, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const menuRef = React.useRef<Menu>(null);

  if (!actividad) {
    return <div className="activity-card-empty">Actividad no disponible</div>;
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Ver detalles',
      icon: 'pi pi-eye',
      command: () => setShowDetails(true),
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => setShowEdit(true),
    },
    {
      label: 'Añadir tarea',
      icon: 'pi pi-check-square',
      command: () => setShowCreateTask(true),
    },
    {
      label: 'Añadir factura',
      icon: 'pi pi-euro',
      command: () => setShowAddInvoice(true),
    },
    {
      separator: true,
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      className: 'text-red-500',
      command: () => setShowDelete(true),
    },
  ];

  // ==================== Formatear rango de fechas ====================
  const formatearRangoFechas = () => {
    const inicio = new Date(actividad.fecha_inicio);
    const fin = new Date(actividad.fecha_fin);

    const horaInicio = inicio.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const horaFin = fin.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const fechaInicio = inicio.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    const fechaFin = fin.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    if (fechaInicio === fechaFin) {
      return `${horaInicio} - ${horaFin} ${fechaInicio}`;
    }

    return `${horaInicio} ${fechaInicio} - ${horaFin} ${fechaFin}`;
  };

  // ==================== Calcular duración ====================
  const calcularDuracion = () => {
    const inicio = new Date(actividad.fecha_inicio);
    const fin = new Date(actividad.fecha_fin);
    const diff = fin.getTime() - inicio.getTime();

    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (horas > 24) {
      const dias = Math.floor(horas / 24);
      return `${dias}d ${horas % 24}h`;
    }

    return horas > 0 ? `${horas}h ${minutos}m` : `${minutos}m`;
  };

  // ==================== Colores según tipo ====================
  const getTipoColor = (tipo: string): string => {
    const colores: Record<string, string> = {
      Programación: 'bg-blue-100 text-blue-800 border-blue-300',
      Oración: 'bg-purple-100 text-purple-800 border-purple-300',
      Comisión: 'bg-orange-100 text-orange-800 border-orange-300',
      'Actividad normal': 'bg-green-100 text-green-800 border-green-300',
      Reunión: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Formación: 'bg-pink-100 text-pink-800 border-pink-300',
    };

    return colores[tipo] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // ==================== Colores según sección ====================
  const getSeccionColor = (seccion: string): string => {
    const colores: Record<string, string> = {
      CJ: 'bg-indigo-100 text-indigo-800',
      Chiqui: 'bg-teal-100 text-teal-800',
      Ambas: 'bg-violet-100 text-violet-800',
    };

    return colores[seccion] || 'bg-gray-100 text-gray-800';
  };

  // ==================== Calcular total de participantes ====================
  const totalParticipantes =
    (actividad.animadores_ids?.length ?? 0) + (actividad.participantes_ids?.length ?? 0);

  return (
    <>
      <div className="activity-card">
        {/* Header */}
        <div className="activity-card__header">
          <div className="activity-card__header-content">
            <div className="activity-card__title-row">
              <h3 className="activity-card__title">{actividad.nombre}</h3>
              {actividad.tipo_actividad && (
                <span className={`activity-card__badge ${getTipoColor(actividad.tipo_actividad)}`}>
                  {actividad.tipo_actividad}
                </span>
              )}
            </div>

            {actividad.descripcion && (
              <p className="activity-card__description">{actividad.descripcion}</p>
            )}
          </div>

          <div className="activity-card__header-actions">
            {actividad.seccion && (
              <span className={`activity-card__badge ${getSeccionColor(actividad.seccion)}`}>
                {actividad.seccion}
              </span>
            )}
            {actividad.es_recurrente && (
              <span className="activity-card__badge bg-gray-100 text-gray-700">🔄</span>
            )}
            <button className="activity-card__menu-btn" onClick={(e) => menuRef.current?.toggle(e)}>
              <MoreVertical className="w-5 h-5" />
            </button>
            <Menu model={menuItems} popup ref={menuRef} />
          </div>
        </div>

        {/* Info fecha */}
        <div className="activity-card__info">
          <div className="activity-card__info-item">
            <Calendar className="activity-card__icon" />
            <span className="activity-card__info-text">
              {formatearRangoFechas()}{' '}
              <span className="activity-card__duration">({calcularDuracion()})</span>
            </span>
          </div>

          {actividad.ubicacion && (
            <div className="activity-card__info-item activity-card__info-item--secondary">
              <MapPin className="activity-card__icon" />
              <span>{actividad.ubicacion}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="activity-card__footer">
          <div className="activity-card__footer-content">
            {actividad.responsable && (
              <div className="activity-card__responsible">
                <span className="activity-card__label">Responsable:</span>
                <UserAvatar userId={actividad.responsable.id} size="small" />
              </div>
            )}

            <div className="activity-card__participants">
              <Users className="activity-card__icon" />
              <span className="activity-card__participants-count">{totalParticipantes}</span>
            </div>
          </div>

          {/* ✅ Validar que existe y tiene elementos */}
          {actividad.animadores_ids && actividad.animadores_ids.length > 0 && (
            <div className="activity-card__animators">
              <span className="activity-card__label">Animadores:</span>
              <div className="activity-card__avatar-group">
                {actividad.animadores_ids.slice(0, 5).map((animadorId) => (
                  <UserAvatar
                    key={animadorId}
                    userId={animadorId}
                    size="small"
                    className="activity-card__avatar"
                  />
                ))}
                {actividad.animadores_ids.length > 5 && (
                  <div className="activity-card__avatar-more">
                    +{actividad.animadores_ids.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ActivityDetailsDialog
        visible={showDetails}
        actividad={actividad}
        onHide={() => setShowDetails(false)}
      />

      <ActivityFormDialog
        visible={showEdit}
        actividad={actividad}
        onHide={() => setShowEdit(false)}
        onSuccess={() => {
          setShowEdit(false);
          onUpdate?.();
        }}
      />

      <DeleteConfirmDialog
        visible={showDelete}
        itemName={actividad.nombre}
        onHide={() => setShowDelete(false)}
        onConfirm={async () => {
          // TODO: Implementar eliminación
          setShowDelete(false);
          onUpdate?.();
        }}
      />

      <CreateTaskDialog
        visible={showCreateTask}
        actividadId={actividad.id}
        actividadNombre={actividad.nombre}
        onHide={() => setShowCreateTask(false)}
        onSuccess={() => {
          setShowCreateTask(false);
          onUpdate?.();
        }}
      />

      <AddInvoiceDialog
        visible={showAddInvoice}
        actividadId={actividad.id}
        actividadNombre={actividad.nombre}
        onHide={() => setShowAddInvoice(false)}
        onSuccess={() => {
          setShowAddInvoice(false);
          onUpdate?.();
        }}
      />
    </>
  );
};
