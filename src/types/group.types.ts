export interface GrupoUser {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  rol_id: number;
  rol: string;
  foto_perfil?: string;
  has_avatar?: boolean;
}

export interface Grupo {
  id: number;
  nombre: string;
  centro_juvenil: string;
  seccion: string;
  usuarios: GrupoUser[];
  responsables: number[];
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface GrupoFormData {
  nombre: string;
  centro_juvenil: string;
  seccion: string;
}

export interface UpdateGrupoRequest {
  nombre?: string;
  centro_juvenil?: string;
  seccion?: string;
  miembros?: number[];
}
