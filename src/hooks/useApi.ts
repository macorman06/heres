import { useState } from 'react';
import { Member, Activity, Group, Material } from '../types';

// Mock data
const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Emmanuel Lokossou',
    email: 'emmanuel.lokossou@juvenliber.es',
    role: 'director',
    status: 'active',
    joinDate: '2020-01-15',
    center: 'Centro Juvenil Salesianos',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    name: 'David Corpas',
    email: 'david.corpas@juvenliber.es',
    role: 'animador',
    status: 'active',
    joinDate: '2021-03-10',
    center: 'Centro Juvenil Salesianos',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    name: 'Olaya Corral',
    email: 'olaya.corral@juvenliber.es',
    role: 'coordinador',
    status: 'active',
    joinDate: '2020-09-05',
    center: 'Centro Juvenil Salesianos',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '4',
    name: 'Marcos Corpas',
    email: 'marcos.corpas@juvenliber.es',
    role: 'animador',
    status: 'active',
    joinDate: '2021-11-20',
    center: 'Centro Juvenil Salesianos',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '5',
    name: 'Fernando Gracia',
    email: 'fernando.gracia@juvenliber.es',
    role: 'coordinador',
    status: 'active',
    joinDate: '2019-06-12',
    center: 'Centro Juvenil Salesianos',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '6',
    name: 'Ricardo Fernandez',
    email: 'ricardo.fernandez@juvenliber.es',
    role: 'animador',
    status: 'active',
    joinDate: '2022-02-28',
    center: 'Centro Juvenil Salesianos',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Taller de Música',
    description: 'Sesión de práctica musical para jóvenes',
    date: '2024-01-20',
    time: '16:00',
    location: 'Sala de Música',
    status: 'scheduled',
    participants: 12,
    maxParticipants: 20,
    coordinator: 'David Corpas'
  },
  {
    id: '2',
    title: 'Encuentro Juvenil',
    description: 'Encuentro mensual de reflexión y convivencia',
    date: '2024-01-25',
    time: '18:30',
    location: 'Salón Principal',
    status: 'ongoing',
    participants: 35,
    maxParticipants: 40,
    coordinator: 'Olaya Corral'
  },
  {
    id: '3',
    title: 'Torneo de Fútbol',
    description: 'Competición deportiva entre grupos',
    date: '2024-01-15',
    time: '17:00',
    location: 'Patio Deportivo',
    status: 'completed',
    participants: 24,
    maxParticipants: 24,
    coordinator: 'Marcos Corpas'
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Chiquicentro',
    description: 'Grupo de niños de 6 a 10 años',
    memberCount: 25,
    coordinator: 'Fernando Gracia',
    category: 'Infantil',
    status: 'active',
    createdDate: '2020-09-01'
  },
  {
    id: '2',
    name: 'Preadolescentes',
    description: 'Grupo de preadolescentes de 11 a 13 años',
    memberCount: 18,
    coordinator: 'David Corpas',
    category: 'Preadolescente',
    status: 'active',
    createdDate: '2021-01-15'
  },
  {
    id: '3',
    name: 'Juvenil',
    description: 'Grupo de jóvenes de 14 a 17 años',
    memberCount: 22,
    coordinator: 'Olaya Corral',
    category: 'Juvenil',
    status: 'active',
    createdDate: '2020-10-10'
  }
];

const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Manual de Actividades Juveniles',
    type: 'document',
    category: 'Formación',
    uploadDate: '2024-01-10',
    size: '2.5 MB',
    downloadCount: 45,
    uploadedBy: 'Emmanuel Lokossou'
  },
  {
    id: '2',
    title: 'Video Tutorial - Dinámicas de Grupo',
    type: 'video',
    category: 'Tutorial',
    uploadDate: '2024-01-08',
    size: '125 MB',
    downloadCount: 23,
    uploadedBy: 'Olaya Corral'
  },
  {
    id: '3',
    title: 'Canciones para Encuentros',
    type: 'audio',
    category: 'Música',
    uploadDate: '2024-01-05',
    size: '15 MB',
    downloadCount: 67,
    uploadedBy: 'David Corpas'
  }
];

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const simulateApiCall = async <T>(data: T, delay = 800): Promise<T> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setLoading(false);
    return data;
  };

  const getMembers = () => simulateApiCall(mockMembers);
  const getActivities = () => simulateApiCall(mockActivities);
  const getGroups = () => simulateApiCall(mockGroups);
  const getMaterials = () => simulateApiCall(mockMaterials);

  return {
    loading,
    getMembers,
    getActivities,
    getGroups,
    getMaterials
  };
};
