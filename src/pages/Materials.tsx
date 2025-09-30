import React from 'react';
import { Card } from 'primereact/card';

export const Materials: React.FC = () => {
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
            <h1 className="construction-title">¡Biblioteca digital en construcción!</h1>

            <div className="construction-icon">
              <i className="pi pi-folder-open" style={{ fontSize: '3rem', color: 'var(--gecos-primary)' }}></i>
            </div>

            <h2 className="construction-subtitle">Gestión de Materiales</h2>

            <p className="construction-description">
              Estamos creando una biblioteca digital completa para que puedas acceder a todos
              los recursos educativos, documentos, videos y materiales del centro juvenil.
            </p>

            {/* Características que vendrán */}
            <div className="features-preview">
              <h3>¿Qué encontrarás aquí?</h3>
              <ul className="features-list">
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Documentos educativos y formativos</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Videos tutoriales y charlas</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Música y recursos audiovisuales</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Sistema de categorización avanzado</span>
                </li>
              </ul>
            </div>

            {/* Progreso */}
            <div className="construction-progress">
              <div className="progress-info">
                <span className="progress-label">Progreso del desarrollo</span>
                <span className="progress-percentage">60%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer informativo */}
        <div className="construction-footer">
          <p className="construction-note">
            <i className="pi pi-lightbulb"></i>
            ¿Tienes materiales que te gustaría ver aquí? ¡Háznoslo saber!
          </p>
        </div>
      </div>
    </div>
  );
};
