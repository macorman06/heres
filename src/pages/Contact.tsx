import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export const Contact: React.FC = () => {
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
            <h1 className="construction-title">¡Conectando con la comunidad!</h1>

            <div className="construction-icon">
              <i className="pi pi-users" style={{ fontSize: '3rem', color: 'var(--gecos-primary)' }}></i>
            </div>

            <h2 className="construction-subtitle">Centro de Contacto</h2>

            <p className="construction-description">
              Estamos diseñando un espacio completo para que puedas conectar fácilmente
              con todo el equipo del centro juvenil y acceder a toda la información de contacto.
            </p>

            {/* Información temporal básica */}
            <div className="temp-contact-info">
              <h3>Mientras tanto, puedes contactarnos:</h3>
              <div className="contact-quick-info">
                <div className="contact-item">
                  <i className="pi pi-phone"></i>
                  <span>+34 91 XXX XX XX</span>
                </div>
                <div className="contact-item">
                  <i className="pi pi-envelope"></i>
                  <span>info@centrojuvenil.es</span>
                </div>
                <div className="contact-item">
                  <i className="pi pi-map-marker"></i>
                  <span>Centro Juvenil Salesianos</span>
                </div>
              </div>
            </div>

            {/* Características que vendrán */}
            <div className="features-preview">
              <h3>¿Qué encontrarás próximamente?</h3>
              <ul className="features-list">
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Directorio completo del equipo</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Horarios de atención actualizados</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Mapa interactivo de ubicación</span>
                </li>
                <li>
                  <i className="pi pi-check-circle"></i>
                  <span>Formulario de contacto directo</span>
                </li>
              </ul>
            </div>

            {/* Progreso */}
            <div className="construction-progress">
              <div className="progress-info">
                <span className="progress-label">Progreso del desarrollo</span>
                <span className="progress-percentage">40%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Acciones */}
            <div className="construction-actions">
              <Button
                label="Quiero ser notificado"
                icon="pi pi-bell"
                className="p-button-outlined"
                onClick={() => alert('¡Perfecto! Te avisaremos cuando esté listo.')}
              />
              <Button
                label="Volver al inicio"
                icon="pi pi-home"
                onClick={() => window.location.href = '/'}
              />
            </div>
          </div>
        </Card>

        {/* Footer informativo */}
        <div className="construction-footer">
          <p className="construction-note">
            <i className="pi pi-heart"></i>
            Gracias por tu paciencia mientras mejoramos tu experiencia.
          </p>
        </div>
      </div>
    </div>
  );
};
