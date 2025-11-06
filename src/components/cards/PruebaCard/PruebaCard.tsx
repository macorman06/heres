// src/components/cards/PruebaCard/PruebaCard.tsx

import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Prueba } from '../../../types/prueba.types';
import './PruebaCard.css';

interface PruebaCardProps {
  prueba: Prueba;
  onView: (prueba: Prueba) => void;
  onEdit: (prueba: Prueba) => void;
  onDelete: (prueba: Prueba) => void;
}

// ============ FUNCIONES HELPER PARA COLORES ============
const getTipoColor = (tipo: string) => {
  const colores: Record<string, { bg: string; text: string }> = {
    Deporte: { bg: '#DBEAFE', text: '#1E40AF' },
    Puntería: { bg: '#FED7AA', text: '#9A3412' },
    'Memoria y Lógica': { bg: '#E9D5FF', text: '#6B21A8' },
    Trivial: { bg: '#BFDBFE', text: '#1E3A8A' },
    'Trivial Cultural': { bg: '#BFDBFE', text: '#1E3A8A' },
    'Trivial Digital': { bg: '#93C5FD', text: '#1E3A8A' },
    'Azar e Inteligencia': { bg: '#E9D5FF', text: '#6B21A8' },
    Creatividad: { bg: '#FDE68A', text: '#92400E' },
    Musical: { bg: '#D1FAE5', text: '#065F46' },
    'Expresión Musical y Creatividad': { bg: '#A7F3D0', text: '#065F46' },
    'Expresión Artística y Creatividad': { bg: '#FCD34D', text: '#92400E' },
    Adivinanzas: { bg: '#FBCFE8', text: '#9F1239' },
    'Adivinanzas y Actuación': { bg: '#F9A8D4', text: '#9F1239' },
    'Cooperación y Habilidad': { bg: '#C7D2FE', text: '#3730A3' },
    'Deporte - Batalla': { bg: '#FCA5A5', text: '#991B1B' },
    'Deporte y Creatividad': { bg: '#BAE6FD', text: '#075985' },
  };
  return colores[tipo] || { bg: '#E5E7EB', text: '#374151' };
};

const getNivelColor = (nivel: string) => {
  const colores: Record<string, { bg: string; text: string }> = {
    Bajo: { bg: '#D1FAE5', text: '#065F46' },
    Medio: { bg: '#FED7AA', text: '#9A3412' },
    Alto: { bg: '#FECACA', text: '#991B1B' },
  };
  return colores[nivel] || { bg: '#E5E7EB', text: '#374151' };
};

export const PruebaCard: React.FC<PruebaCardProps> = ({ prueba, onView, onEdit, onDelete }) => {
  const menuRef = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Ver Detalles',
      icon: 'pi pi-eye',
      command: () => onView(prueba),
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => onEdit(prueba),
    },
    {
      separator: true,
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      className: 'text-red-500',
      command: () => onDelete(prueba),
    },
  ];

  const tipoColor = getTipoColor(prueba.tipo || '');
  const nivelColor = getNivelColor(prueba.nivel_dificultad || '');

  return (
    <Card className="prueba-card">
      <div className="prueba-card-container">
        {/* Header: Título y Tipo */}
        <div className="prueba-card-header">
          <h3 className="prueba-titulo">{prueba.nombre}</h3>
          <div className="chip-container">
            {prueba.tipo && (
              <Chip
                label={prueba.tipo}
                style={{
                  backgroundColor: tipoColor.bg,
                  color: tipoColor.text,
                  height: '25px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              />
            )}
          </div>
        </div>

        {/* Descripción limitada a 3 líneas */}
        <div className="prueba-descripcion">{prueba.descripcion || 'Sin descripción'}</div>

        {/* Metadatos: Edad, Duración, Nivel */}
        <div className="prueba-metadata">
          {prueba.edad_recomendada_min && prueba.edad_recomendada_max && (
            <div className="metadata-item">
              <i className="pi pi-users" style={{ fontSize: '0.75rem' }}></i>
              <span>{`${prueba.edad_recomendada_min}-${prueba.edad_recomendada_max} años`}</span>
            </div>
          )}
          {prueba.duracion_estimada && (
            <div className="metadata-item">
              <i className="pi pi-clock" style={{ fontSize: '0.75rem' }}></i>
              <span>{prueba.duracion_estimada} min</span>
            </div>
          )}
        </div>

        {/* Footer: Nivel y Botón de menú */}
        <div className="prueba-card-footer">
          {/* Chip de Nivel (izquierda) */}
          {prueba.nivel_dificultad && (
            <Chip
              label={prueba.nivel_dificultad}
              style={{
                backgroundColor: nivelColor.bg,
                color: nivelColor.text,
                height: '25px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            />
          )}

          {/* Lugar (centro) */}
          {prueba.lugar && (
            <div className="prueba-lugar">
              <i
                className="pi pi-map-marker"
                style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}
              ></i>
              {prueba.lugar}
            </div>
          )}

          {/* Botón de menú (derecha) */}
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={(e) => menuRef.current?.toggle(e)}
            aria-label="Opciones"
          />
          <Menu model={menuItems} popup ref={menuRef} />
        </div>
      </div>
    </Card>
  );
};
