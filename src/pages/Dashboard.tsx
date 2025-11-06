// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ScheduledActivities } from '../components/dashboard/ScheduledActivities';
import { Calendar, Users, TrendingUp, Award } from 'lucide-react';
import { userService, actividadesService } from '../services/api/index';
import '../styles/4-pages/dashboard.css';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    proximasActividades: 0,
    miembrosActivos: 0,
    participacion: 0,
    puntosTotales: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener stats reales del backend
        const actividades = await actividadesService.listar();
        const usuarios = await userService.getUsers();

        // Calcular próximas actividades
        const ahora = new Date();
        const proximas = actividades.filter(
          (act: any) => new Date(act.fecha_inicio) >= ahora
        ).length;

        // Contar usuarios activos
        const activos = usuarios.filter((u: any) => u.is_active).length;

        setStats({
          proximasActividades: proximas,
          miembrosActivos: activos,
          participacion: 85, // TODO: Calcular real
          puntosTotales: 2450, // TODO: Calcular real desde ranking
        });
      } catch (error) {
        console.error('Error cargando stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header de bienvenida */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Hola, {user?.nombre} 👋</h1>
          <p className="dashboard-subtitle">Bienvenido a tu panel de control de HERES</p>
        </div>
      </div>

      {/* Grid de stats cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Próximas actividades</p>
            <p className="stat-card__value">{stats.proximasActividades}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-card__icon">
            <Users className="w-6 h-6" />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Miembros activos</p>
            <p className="stat-card__value">{stats.miembrosActivos}</p>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-card__icon">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Participación</p>
            <p className="stat-card__value">{stats.participacion}%</p>
          </div>
        </div>

        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon">
            <Award className="w-6 h-6" />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Puntos totales</p>
            <p className="stat-card__value">{stats.puntosTotales.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Grid principal con actividades y widgets */}
      <div className="dashboard-main-grid">
        {/* Columna principal - Actividades programadas */}
        <div className="dashboard-main-column">
          <ScheduledActivities />
        </div>

        {/* Columna lateral - Widgets */}
        <div className="dashboard-sidebar-column">
          {/* Widget de tareas pendientes */}
          <div className="widget-card">
            <div className="widget-card__header">
              <h3 className="widget-card__title">Tareas pendientes</h3>
              <span className="widget-card__badge">3</span>
            </div>
            <div className="widget-card__content">
              <div className="task-item">
                <div className="task-item__checkbox">
                  <input type="checkbox" className="checkbox" />
                </div>
                <div className="task-item__content">
                  <p className="task-item__title">Revisar material de catequesis</p>
                  <p className="task-item__meta">Vence hoy</p>
                </div>
              </div>
              <div className="task-item">
                <div className="task-item__checkbox">
                  <input type="checkbox" className="checkbox" />
                </div>
                <div className="task-item__content">
                  <p className="task-item__title">Confirmar asistencia reunión</p>
                  <p className="task-item__meta">Vence mañana</p>
                </div>
              </div>
              <div className="task-item">
                <div className="task-item__checkbox">
                  <input type="checkbox" className="checkbox" />
                </div>
                <div className="task-item__content">
                  <p className="task-item__title">Preparar actividad del sábado</p>
                  <p className="task-item__meta">Vence en 3 días</p>
                </div>
              </div>
            </div>
            <div className="widget-card__footer">
              <a href="/tasks" className="widget-card__link">
                Ver todas las tareas →
              </a>
            </div>
          </div>

          {/* Widget de anuncios */}
          <div className="widget-card">
            <div className="widget-card__header">
              <h3 className="widget-card__title">Anuncios</h3>
            </div>
            <div className="widget-card__content">
              <div className="announcement-item">
                <div className="announcement-item__dot announcement-item__dot--blue"></div>
                <div className="announcement-item__content">
                  <p className="announcement-item__title">Cambio de horario</p>
                  <p className="announcement-item__text">
                    La reunión del próximo viernes se adelanta a las 18:00h
                  </p>
                  <p className="announcement-item__meta">Hace 2 horas</p>
                </div>
              </div>
              <div className="announcement-item">
                <div className="announcement-item__dot announcement-item__dot--green"></div>
                <div className="announcement-item__content">
                  <p className="announcement-item__title">Nueva actividad</p>
                  <p className="announcement-item__text">
                    Se ha programado un retiro para el próximo mes
                  </p>
                  <p className="announcement-item__meta">Ayer</p>
                </div>
              </div>
            </div>
            <div className="widget-card__footer">
              <a href="/announcements" className="widget-card__link">
                Ver todos →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
