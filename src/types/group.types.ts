export interface Grupo {
  id: number;
  nombre: string;
  centro_juvenil: string;
  seccion: string;
  usuarios: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  }[];
  responsables: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  }[];
  status: 'active' | 'inactive';
}

export interface FormData {
  nombre: string;
  centro_juvenil: string;
  seccion: string;
}