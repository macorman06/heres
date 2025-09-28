import React from 'react';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { RecentMember, getSectionColor } from '../../data';

interface MemberCardProps {
  member: RecentMember & { joinDate?: string };
  onView: (member: RecentMember & { joinDate?: string }) => void;
  onEdit: (member: RecentMember & { joinDate?: string }) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onView, onEdit }) => {
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'Director':
        return 'bg-red-500';
      case 'Coordinador':
      case 'Coordinadora':
        return 'bg-blue-500';
      case 'Animador':
        return 'bg-green-500';
      case 'Miembro Activo':
        return 'bg-yellow-500';
      case 'Miembro Nuevo':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCardClick = () => {
    onView(member);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(member);
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se dispare el click de la card
  };

  return (
    <Card
      className="pt-1 border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-xl overflow-hidden cursor-pointer"
      onClick={handleCardClick}
      pt={{
        body: { className: 'p-3' },
        content: { className: 'p-0' }
      }}
    >
      <div className="relative">
        {/* Section Chip - Top Left */}
        <div className="absolute top-2 left-2" onClick={handleSectionClick}>
          <Chip
            label={member.section}
            className={`${getSectionColor(member.section)} text-xs px-2 py-0 font-medium rounded-xxl`}
          />
        </div>

        {/* Edit Button - Top Right */}
        <Button
          icon="pi pi-pencil"
          className="absolute top-2 right-2 p-0 bg-transparent border-0 text-gray-400 hover:text-red-500 transition-colors duration-200"
          onClick={handleEditClick}
          aria-label="Editar miembro"
        />

        {/* Header with Avatar, Name and Email */}
        <div className="text-center mb-4"> {/* ✅ Añadido mt-6 para dar espacio al chip */}
          <div className="relative inline-block mb-4">
            <Avatar
              image={member.avatar}
              label={member.name.charAt(0)}
              size="xlarge"
              shape="circle"
              className="bg-red-500 text-white border-4 border-white shadow-lg"
              style={{ width: '80px', height: '80px', fontSize: '2rem' }}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {member.name}
          </h3>
          <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
            <i className="pi pi-envelope mr-2 text-gray-400"></i>
            <span className="break-all">{member.email}</span>
          </div>
        </div>

        {/* Role Chip - Center Bottom */}
        <div className="flex justify-center">
          <Chip
            label={member.role}
            className={`${getRoleColor(member.role)} text-white text-sm px-4 py-0 font-medium rounded-xxl`}
          />
        </div>
      </div>
    </Card>
  );
};
