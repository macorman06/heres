import React from 'react';
import { Card } from 'primereact/card';

export const Activities: React.FC = () => {
  return (
    <div className="under-construction-page">
      <div className="construction-container">
        {/* Logo y animación */}
        <div className="construction-logo">
          <div className="gear-animation">
            <i className="pi pi-cog" style={{ fontSize: '4rem', color: 'var(--gecos-primary)' }}></i>
            <i className="pi pi-cog gear-small" style={{ fontSize: '2.5rem', color: 'var(--gecos-primary)' }}></i>
          </div>
        </div>

        {/* Contenido principal */}
        <Card className="construction-card">
          <div className="construction-content">
            <h1 className="construction-title">¡Estamos trabajando en algo increíble!</h1>

            <div className="construction-icon">
              <i className="pi pi-calendar" style={{ fontSize: '3rem', color: 'var(--gecos-primary)' }}></i>
            </div>

            <h2 className="construction-subtitle">Gestión de Actividades</h2>

            <p className="construction-description">
              Pronto podrás gestionar todas las actividades del centro juvenil desde aquí.
              Organizaremos eventos, talleres, encuentros y mucho más de manera sencilla e intuitiva.
            </p>

            {/* Características que vendrán */}
            <div className="features-preview">
              <h3>¿Qué podrás hacer próximamente?</h3>
              <ul className="features-list">
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Crear y programar actividades</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Gestionar inscripciones</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Seguimiento de participantes</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Calendario de eventos integrado</span>
                </li>
              </ul>
            </div>

            {/* Progreso */}
            <div className="construction-progress">
              <div className="progress-info">
                <span className="progress-label">Progreso del desarrollo</span>
                <span className="progress-percentage">75%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer informativo */}
        <div className="construction-footer">
          <p className="construction-note">
            <i className="pi pi-info-circle"></i>
            Mientras tanto, puedes usar el módulo de gestión de usuarios que ya está disponible.
          </p>
        </div>
      </div>
    </div>
  );
};
