import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Member } from '../../types';

interface MemberCardProps {
  member: Member;
  onEdit?: (member: Member) => void;
  onView?: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onView }) => {
  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const header = (
    <div className="relative">
      <div className="h-24 bg-gradient-to-r from-red-400 to-red-600"></div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <Avatar
          image={member.avatar}
          label={member.name.charAt(0)}
          size="large"
          shape="circle"
          className="bg-white border-4 border-white shadow-lg"
        />
      </div>
    </div>
  );

  return (
    <Card 
      header={header}
      className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
    >
      <div className="text-center pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{member.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{member.role}</p>
        
        <div className="flex justify-center mb-3">
          <Badge 
            value={getStatusLabel(member.status)} 
            severity={getStatusSeverity(member.status) as any}
          />
        </div>

        <div className="text-xs text-gray-500 mb-4">
          <p className="mb-1">
            <i className="pi pi-envelope mr-1" />
            {member.email}
          </p>
          <p>
            <i className="pi pi-calendar mr-1" />
            Desde {new Date(member.joinDate).toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="flex justify-center space-x-2">
          {onView && (
            <Button
              icon="pi pi-eye"
              size="small"
              outlined
              onClick={() => onView(member)}
              tooltip="Ver detalles"
            />
          )}
          {onEdit && (
            <Button
              icon="pi pi-pencil"
              size="small"
              onClick={() => onEdit(member)}
              tooltip="Editar"
              className="bg-red-600 border-red-600"
            />
          )}
        </div>
      </div>
    </Card>
  );
};