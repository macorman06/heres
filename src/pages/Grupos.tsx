// src/pages/Grupos.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../hooks/useApi';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Badge } from 'primereact/badge';

interface Grupo {
  id: number;
  nombre: string;
  centro_juvenil: string;
  seccion: string;
  usuarios: Array<{
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  }>;
}

export const Grupos: React.FC = () => {
  const navigate = useNavigate();
  const { groups, loading, error, fetchAllGroups } = useGroups();

  useEffect(() => {
    fetchAllGroups();
  }, [fetchAllGroups]);

  const handleCardClick = (grupoId: number) => {
    navigate(`/grupos/${grupoId}`);
  };

  if (loading) {
    return (
      <div className="grupos-container">
        <div className="grupos-header">
          <Skeleton width="200px" height="2.5rem" className="mb-2" />
          <Skeleton width="300px" height="1.5rem" />
        </div>
        <div className="grupos-grid">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="grupo-card">
              <Skeleton width="100%" height="150px" className="mb-3" />
              <Skeleton width="80%" height="1.5rem" className="mb-2" />
              <Skeleton width="60%" height="1rem" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grupos-container">
        <div className="error-container">
          <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
          <h2>Error al cargar grupos</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grupos-container">
      <div className="grupos-header">
        <h1>Mis grupos</h1>
        <p className="subtitle">Gestiona y consulta los grupos a los que perteneces.</p>
      </div>

      {!groups || groups.length === 0 ? (
        <div className="empty-state">
          <i className="pi pi-users" style={{ fontSize: '4rem', color: '#94a3b8' }}></i>
          <h3>No hay grupos disponibles</h3>
          <p>Aún no se han creado grupos en el sistema</p>
        </div>
      ) : (
        <div className="grupos-grid">
          {groups.map((grupo: Grupo) => {

            return (
              <Card
                key={grupo.id}
                className="grupo-card"
                onClick={() => handleCardClick(grupo.id)}
              >
                <div className="card-content">
                  <div className="card-body">
                    <div className="card-header-section">
                      <h3 className="grupo-nombre">{grupo.nombre}</h3>
                      <Badge
                        value={grupo.seccion}
                        severity="info"
                        className="seccion-badge"
                      />
                    </div>

                    <div className="grupo-info">
                      <div className="info-item">
                        <i className="pi pi-map-marker"></i>
                        <span>{grupo.centro_juvenil}</span>
                      </div>

                      <div className="info-item">
                        <i className="pi pi-users"></i>
                        <span>
                          {grupo.usuarios?.length || 0} miembro{grupo.usuarios?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {grupo.usuarios && grupo.usuarios.length > 0 && (
                      <div className="usuarios-preview">
                        <div className="avatars-stack">
                          {grupo.usuarios.slice(0, 3).map((usuario, index) => (
                            <div
                              key={usuario.id}
                              className="avatar"
                              style={{ zIndex: 3 - index }}
                              title={`${usuario.nombre} ${usuario.apellido1}`}
                            >
                              {usuario.nombre.charAt(0)}{usuario.apellido1.charAt(0)}
                            </div>
                          ))}
                          {grupo.usuarios.length > 3 && (
                            <div className="avatar more" style={{ zIndex: 0 }}>
                              +{grupo.usuarios.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
