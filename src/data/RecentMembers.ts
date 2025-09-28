export interface RecentMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  section: 'Chiqui' | 'CJ' | 'Ambas';
  joinedDate: string;
  status: 'active' | 'inactive';
  lastActivity: string;
  email?: string;
}

export const mockRecentMembers: RecentMember[] = [
  {
    id: '1',
    name: 'Emmanuel Lokossou',
    avatar: '/users/emmanuel_lokossou.png',
    role: 'Director',  // ✅ Cambiado a Director
    section: 'Ambas',  // ✅ Cambiado a Ambas
    joinedDate: '2024-09-15',
    status: 'active',
    lastActivity: 'Hace 2 horas',
    email: 'emmanuel.lokossou@example.com'
  },
  {
    id: '2',
    name: 'David Corpas',
    avatar: '/users/david_corpas.png',
    role: 'Animador',
    section: 'CJ',
    joinedDate: '2024-09-12',
    status: 'active',
    lastActivity: 'Hace 5 horas',
    email: 'david.corpas@example.com'
  },
  {
    id: '3',
    name: 'Olaya Corral',
    avatar: '/users/olaya_corral.png',
    role: 'Coordinadora',  // ✅ Cambiado a Coordinadora
    section: 'CJ',         // ✅ Cambiado a CJ
    joinedDate: '2024-09-10',
    status: 'active',
    lastActivity: 'Hace 1 día',
    email: 'olaya.corral@example.com'
  },
  {
    id: '4',
    name: 'Fernando Gracia',
    avatar: '/users/fernando_gracia.png',
    role: 'Coordinador',  // ✅ Cambiado a Coordinador
    section: 'Chiqui',    // ✅ Cambiado a Chiqui
    joinedDate: '2024-09-08',
    status: 'active',
    lastActivity: 'Hace 3 horas',
    email: 'fernando.gracia@example.com'
  },
  {
    id: '5',
    name: 'Iker Gómez',
    avatar: '/users/iker_gomez.png',
    role: 'Animador',  // ✅ Cambiado a Animador
    section: 'CJ',     // ✅ Cambiado a CJ
    joinedDate: '2024-09-05',
    status: 'active',
    lastActivity: 'Hace 6 horas',
    email: 'iker.gomez@example.com'
  },
  {
    id: '6',
    name: 'Diego Vázquez',
    avatar: '/users/diego_vazquez.png',
    role: 'Animador',  // ✅ Cambiado a Animador
    section: 'CJ',     // ✅ Cambiado a CJ
    joinedDate: '2024-09-03',
    status: 'active',
    lastActivity: 'Hace 4 horas',
    email: 'diego.vazquez@example.com'
  },
  {
    id: '7',
    name: 'Marcos Corpas',
    avatar: '/users/marcos_corpas.png',
    role: 'Animador',  // ✅ Cambiado a Animador
    section: 'CJ',     // ✅ Cambiado a CJ
    joinedDate: '2024-09-20',
    status: 'active',
    lastActivity: 'Hace 1 hora',
    email: 'marcos.corpas@example.com'
  }
];

// Función para obtener el color del role
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'Director':
      return 'bg-red-100 text-red-800';
    case 'Coordinador':
    case 'Coordinadora':
      return 'bg-blue-100 text-blue-800';
    case 'Animador':
      return 'bg-green-100 text-green-800';
    case 'Miembro Activo':
      return 'bg-yellow-100 text-yellow-800';
    case 'Miembro Nuevo':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Función para obtener el color de la sección
export const getSectionColor = (section: string): string => {
  switch (section) {
    case 'Chiqui':
      return 'bg-blue-100 text-blue-800';
    case 'CJ':
      return 'bg-red-100 text-red-800';
    case 'Ambas':
      return 'bg-purple-100 text-purple-800';
    case 'Animador':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Función para obtener miembros recientes (ordenados por fecha de ingreso)
export const getRecentMembers = (limit: number = 6): RecentMember[] => {
  return mockRecentMembers
    .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    .slice(0, limit);
};
