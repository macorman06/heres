export interface CalendarEvent {
  id: string;
  date: {
    day: string;
    dayName: string;
    month: string;
  };
  type: string;
  title: string;
  time: string;
  location: string;
  responsible: {
    name: string;
    avatar: string;
  };
  participants: Array<{
    name: string;
    avatar?: string;
  }>;
  badge: string;
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    date: { day: '14 y 15', dayName: 'Sab - Dom', month: 'Septiembre' },
    type: 'PROGRAMACIÓN',
    title: 'Programación inicial del curso 2024/25',
    time: '8:00 - 17:00',
    location: 'CJ Aranjuez',
    responsible: {
      name: 'Emmanuel Lokossou',
      avatar: '/users/emmanuel_lokossou.png'
    },
    participants: [
      { name: 'David Corpas', avatar: '/users/david_corpas.png' },
      { name: 'Olaya Corral', avatar: '/users/olaya_corral.png' },
      { name: 'Fernando Gracia', avatar: '/users/fernando_gracia.png' }
    ],
    badge: 'Ambas'
  },
  {
    id: '2',
    date: { day: '21', dayName: 'Sab', month: 'Septiembre' },
    type: 'IEF',
    title: 'Formación de Itinerario de Educación en la Fe',
    time: '20:00 - 18:00',
    location: 'CJ Atocha',
    responsible: {
      name: 'David Corpas',
      avatar: '/users/david_corpas.png'
    },
    participants: [
      { name: 'Emmanuel Lokossou', avatar: '/users/emmanuel_lokossou.png' },
      { name: 'Olaya Corral', avatar: '/users/olaya_corral.png' },
      { name: 'Diego Vázquez', avatar: '/users/diego_vazquez.png' }
    ],
    badge: 'Chiqui'
  },
  {
    id: '3',
    date: { day: '28', dayName: 'Sab', month: 'Septiembre' },
    type: 'TRABAJO EN COMISIONES',
    title: 'Preparación de las comisiones por grupos',
    time: '8:00 - 17:00',
    location: 'CJ Aranjuez',
    responsible: {
      name: 'Olaya Corral',
      avatar: '/users/olaya_corral.png'
    },
    participants: [
      { name: 'Emmanuel Lokossou', avatar: '/users/emmanuel_lokossou.png' },
      { name: 'David Corpas', avatar: '/users/david_corpas.png' },
      { name: 'Fernando Gracia', avatar: '/users/fernando_gracia.png' },
      { name: 'Iker Gómez', avatar: '/users/iker_gomez.png' }
    ],
    badge: 'CJ'
  },
  {
    id: '4',
    date: { day: '04', dayName: 'Vie', month: 'Octubre' },
    type: 'ORACIÓN',
    title: 'Primera oración de viernes de animadores',
    time: '20:30 - 21:00',
    location: 'CJ Parla',
    responsible: {
      name: 'Fernando Gracia',
      avatar: '/users/fernando_gracia.png'
    },
    participants: [
      { name: 'Emmanuel Lokossou', avatar: '/users/emmanuel_lokossou.png' },
      { name: 'David Corpas', avatar: '/users/david_corpas.png' },
      { name: 'Marcos Corpas', avatar: '/users/marcos_corpas.png' }
    ],
    badge: 'Chiqui'
  },
  {
    id: '5',
    date: { day: '04', dayName: 'Vie', month: 'Octubre' },
    type: 'REUNIÓN SEMANAL',
    title: 'Reunión conjunta y por secciones',
    time: '21:00 - 22:30',
    location: 'CJ Parla',
    responsible: {
      name: 'Iker Gómez',
      avatar: '/users/iker_gomez.png'
    },
    participants: [
      { name: 'Emmanuel Lokossou', avatar: '/users/emmanuel_lokossou.png' },
      { name: 'David Corpas', avatar: '/users/david_corpas.png' },
      { name: 'Olaya Corral', avatar: '/users/olaya_corral.png' },
      { name: 'Diego Vázquez', avatar: '/users/diego_vazquez.png' }
    ],
    badge: 'Ambas'
  },
  {
    id: '6',
    date: { day: '05', dayName: 'Sab', month: 'Octubre' },
    type: 'ACTIVIDAD NORMAL',
    title: 'Inicio del curso',
    time: '16:30 - 20:00',
    location: 'CJ Parla',
    responsible: {
      name: 'Diego Vázquez',
      avatar: '/users/diego_vazquez.png'
    },
    participants: [
      { name: 'Emmanuel Lokossou', avatar: '/users/emmanuel_lokossou.png' },
      { name: 'Marcos Corpas', avatar: '/users/marcos_corpas.png' },
      { name: 'Fernando Gracia', avatar: '/users/fernando_gracia.png' }
    ],
    badge: 'CJ'
  },
  {
    id: '7',
    date: { day: '11', dayName: 'Vie', month: 'Octubre' },
    type: 'ORACIÓN',
    title: 'Oración semanal de animadores',
    time: '20:30 - 21:00',
    location: 'CJ Parla',
    responsible: {
      name: 'Marcos Corpas',
      avatar: '/users/marcos_corpas.png'
    },
    participants: [
      { name: 'Emmanuel Lokossou', avatar: '/users/emmanuel_lokossou.png' },
      { name: 'David Corpas', avatar: '/users/david_corpas.png' },
      { name: 'Olaya Corral', avatar: '/users/olaya_corral.png' }
    ],
    badge: 'Chiqui'
  },
  {
    id: '8',
    date: { day: '12', dayName: 'Sab', month: 'Octubre' },
    type: 'ACTIVIDAD NORMAL',
    title: 'Actividad regular de grupos',
    time: '16:30 - 20:00',
    location: 'CJ Parla',
    responsible: {
      name: 'Emmanuel Lokossou',
      avatar: '/users/emmanuel_lokossou.png'
    },
    participants: [
      { name: 'David Corpas', avatar: '/users/david_corpas.png' },
      { name: 'Olaya Corral', avatar: '/users/olaya_corral.png' },
      { name: 'Iker Gómez', avatar: '/users/iker_gomez.png' },
      { name: 'Diego Vázquez', avatar: '/users/diego_vazquez.png' }
    ],
    badge: 'CJ'
  },
  {
    id: '9',
    date: { day: '18', dayName: 'Vie', month: 'Octubre' },
    type: 'FORMACIÓN',
    title: 'Taller de liderazgo juvenil',
    time: '19:00 - 21:30',
    location: 'CJ Atocha',
    responsible: {
      name: 'Olaya Corral',
      avatar: '/users/olaya_corral.png'
    },
    participants: [
      { name: 'Marcos Corpas', avatar: '/users/marcos_corpas.png' },
      { name: 'Fernando Gracia', avatar: '/users/fernando_gracia.png' },
      { name: 'Iker Gómez', avatar: '/users/iker_gomez.png' }
    ],
    badge: 'Ambas'
  }
];

// Función para obtener colores según el tipo de evento
export const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'PROGRAMACIÓN':
      return 'bg-orange-500';
    case 'IEF':
      return 'bg-blue-500';
    case 'TRABAJO EN COMISIONES':
      return 'bg-purple-500';
    case 'ORACIÓN':
      return 'bg-green-500';
    case 'REUNIÓN SEMANAL':
      return 'bg-indigo-500';
    case 'ACTIVIDAD NORMAL':
      return 'bg-red-500';
    case 'FORMACIÓN':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

// Opciones de filtro - SIN as const para evitar readonly
export const FILTER_OPTIONS = [
  { label: 'Todas las actividades', value: 'all' },
  { label: 'Solo Chiqui', value: 'Chiqui' },
  { label: 'Solo CJ', value: 'CJ' },
  { label: 'Ambas secciones', value: 'Ambas' }
];

export type FilterOption = 'all' | 'Chiqui' | 'CJ' | 'Ambas';
