import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Member } from '../../types';
import { formatRole, formatStatus } from '../../utils/roleTranslations';

interface MemberCardProps {
  member: Member;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onView, onEdit }) => {
  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar
            image={member.avatar}
            label={member.name.charAt(0)}
            size="large"
            shape="circle"
            className="bg-red-500 text-white"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{formatRole(member.role)}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <i className="pi pi-envelope text-gray-400 mr-2 w-4"></i>
            <span className="truncate">{member.email}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <i className="pi pi-calendar text-gray-400 mr-2 w-4"></i>
            <span>Desde {new Date(member.joinDate).toLocaleDateString('es-ES')}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <i className="pi pi-building text-gray-400 mr-2 w-4"></i>
            <span className="truncate">{member.center}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Badge
            value={formatStatus(member.status)}
            severity={getStatusSeverity(member.status)}
            className="text-xs"
          />

          <div className="flex space-x-2">
            <Button
              icon="pi pi-eye"
              size="small"
              outlined
              tooltip="Ver detalles"
              tooltipOptions={{ position: 'top' }}
              onClick={() => onView(member)}
              className="p-button-sm"
            />
            <Button
              icon="pi pi-pencil"
              size="small"
              tooltip="Editar"
              tooltipOptions={{ position: 'top' }}
              className="bg-red-600 border-red-600 hover:bg-red-700 p-button-sm"
              onClick={() => onEdit(member)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
