// src/components/dialog/ResponsablesDialog/ResponsablesDialog.tsx

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Badge } from 'primereact/badge';
import './ResponsablesDialog.css';

interface Usuario {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  rol_id: number;
  rol: string;
}

interface ResponsablesDialogProps {
  visible: boolean;
  grupoNombre: string;
  usuarios: Usuario[];
  responsablesActuales: number[];
  onHide: () => void;
  onSave: (responsablesIds: number[]) => void;
}

export const ResponsablesDialog: React.FC<ResponsablesDialogProps> = ({
  visible,
  grupoNombre,
  usuarios,
  responsablesActuales,
  onHide,
  onSave,
}) => {
  const [selectedResponsables, setSelectedResponsables] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      const responsables = Array.isArray(responsablesActuales) ? responsablesActuales : [];
      setSelectedResponsables([...responsables]);

      // ✅ DEBUG: Ver qué usuarios llegan
      console.log('Usuarios recibidos:', usuarios);
      console.log('Responsables actuales:', responsables);
    }
  }, [visible, responsablesActuales, usuarios]);

  // ✅ CORRECCIÓN: Filtrar usuarios que existen Y tienen rol_id válido
  const usuariosElegibles = Array.isArray(usuarios)
    ? usuarios.filter((u) => u && typeof u.rol_id === 'number' && u.rol_id <= 4)
    : [];

  // ✅ DEBUG
  console.log('Usuarios elegibles (rol_id <= 4):', usuariosElegibles);

  const handleToggleResponsable = (userId: number) => {
    setSelectedResponsables((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedResponsables);
  };

  // Template para checkbox
  const checkboxTemplate = (rowData: Usuario) => {
    const isSelected = selectedResponsables.includes(rowData.id);
    return <Checkbox checked={isSelected} onChange={() => handleToggleResponsable(rowData.id)} />;
  };

  // Template para nombre
  const nombreTemplate = (rowData: Usuario) => {
    return (
      <div>
        <div style={{ fontWeight: 500 }}>
          {rowData.nombre} {rowData.apellido1}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{rowData.email}</div>
      </div>
    );
  };

  // Template para rol
  const rolTemplate = (rowData: Usuario) => {
    const rolMap: Record<number, { label: string; severity: 'danger' | 'warning' | 'success' }> = {
      1: { label: 'Superusuario', severity: 'danger' },
      2: { label: 'Director', severity: 'danger' },
      3: { label: 'Coordinador', severity: 'warning' },
      4: { label: 'Animador', severity: 'success' },
    };

    const rol = rolMap[rowData.rol_id] || {
      label: rowData.rol || 'Desconocido',
      severity: 'success',
    };
    return <Badge value={rol.label} severity={rol.severity} />;
  };

  const dialogFooter = (
    <div className="dialog-footer">
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="btn-secondary" />
      <Button label="Guardar" icon="pi pi-check" onClick={handleSave} className="btn-primary" />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Gestionar Responsables: ${grupoNombre}`}
      footer={dialogFooter}
      style={{ width: '600px' }}
      breakpoints={{ '960px': '75vw', '641px': '95vw' }}
      modal
    >
      <div className="responsables-dialog-content">
        <p className="dialog-description">
          Selecciona los usuarios que serán responsables de este grupo. Solo pueden ser responsables
          los usuarios con roles de Animador, Coordinador, Director o Superusuario.
        </p>

        {usuariosElegibles.length === 0 ? (
          <div className="no-elegibles-message">
            <i className="pi pi-info-circle" />
            <div>
              <div>No hay usuarios elegibles para ser responsables en este grupo</div>
              <small style={{ marginTop: '0.5rem', display: 'block' }}>
                {usuarios?.length === 0
                  ? 'El grupo no tiene usuarios asignados.'
                  : 'Ningún usuario tiene rol de Animador, Coordinador, Director o Superusuario.'}
              </small>
            </div>
          </div>
        ) : (
          <DataTable
            value={usuariosElegibles}
            className="responsables-table"
            emptyMessage="No hay usuarios elegibles"
          >
            <Column body={checkboxTemplate} style={{ width: '50px' }} />
            <Column
              field="nombre"
              header="Usuario"
              body={nombreTemplate}
              style={{ minWidth: '250px' }}
            />
            <Column field="rol" header="Rol" body={rolTemplate} style={{ width: '150px' }} />
          </DataTable>
        )}

        <div className="responsables-count">
          <i className="pi pi-users" />
          <span>
            {selectedResponsables.length} responsable{selectedResponsables.length !== 1 ? 's' : ''}{' '}
            seleccionado{selectedResponsables.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Dialog>
  );
};
