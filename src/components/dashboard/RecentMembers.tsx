import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { RecentMember, getRoleColor, getSectionColor } from '../../data/RecentMembers';

interface RecentMembersProps {
  members: RecentMember[];
  loading?: boolean;
  onViewAll?: () => void;
  onMemberClick?: (memberId: string) => void;
}

export const RecentMembers: React.FC<RecentMembersProps> = ({
                                                              members,
                                                              loading = false,
                                                              onViewAll,
                                                              onMemberClick
                                                            }) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const handleMemberClick = (memberId: string) => {
    if (onMemberClick) {
      onMemberClick(memberId);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Miembros Recientes</h2>
          {onViewAll && (
            <Button
              label="Ver todos"
              icon="pi pi-users"
              className="p-button-text p-button-sm text-red-600 !border-0"
              size="small"
              onClick={onViewAll}
            />
          )}
        </div>

        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="pi pi-users text-4xl mb-4 block"></i>
              <p>No hay miembros registrados</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 hover:border-gray-200"
                onClick={() => handleMemberClick(member.id)}
              >
                <div className="relative">
                  <Avatar
                    image={member.avatar}
                    label={member.name.charAt(0)}
                    size="large"
                    shape="circle"
                    className={`${!member.avatar ? 'bg-red-500 text-white' : ''} border-2 border-white shadow-sm`}
                  />
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {member.name}
                    </p>
                    {member.joinedDate && new Date(member.joinedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Nuevo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      value={member.role}
                      className={`${getRoleColor(member.role)} text-xs !flex !items-center !justify-center !leading-none px-2 py-1`}
                    />
                    <Badge
                      value={member.section}
                      className={`${getSectionColor(member.section)} text-xs !flex !items-center !justify-center !leading-none px-2 py-1`}
                    />
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <i className="pi pi-clock mr-1"></i>
                    <span>{member.lastActivity}</span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    icon="pi pi-angle-right"
                    className="p-button-text p-button-sm text-gray-400"
                    size="small"
                  />
                </div>
              </div>
            ))
          )}

          {members.length > 0 && (
            <div className="pt-2 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Mostrando {members.length} miembros más recientes
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
