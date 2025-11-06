// src/types/user.types.ts
import type { CentroJuvenil, Seccion, Sexo, Talla } from './general.types';

// ============================================
// ROLES
// ============================================
export const ROLES = {
  SUPERUSER: 1,
  DIRECTOR: 2,
  COORDINADOR: 3,
  ANIMADOR: 4,
  MIEMBRO: 5,
} as const;

export type RoleId = (typeof ROLES)[keyof typeof ROLES];

// ============================================
// USER INTERFACE
// ============================================
export interface User {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  rol_id: number;
  rol: string;
  grupos?: number[];
  grupo_nombre?: string;
  centro_juvenil?: CentroJuvenil;
  seccion?: Seccion[];
  sexo?: Sexo;
  edad?: number;
  birthday?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: Talla;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  can_login?: boolean;
  ciudad?: string;
  codigo_postal?: string;
  fecha_nacimiento?: string;
  puntuacion?: number;
  has_avatar?: boolean;
}

// ============================================
// CREATE USER REQUEST
// ============================================
export interface UserFormData {
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  password?: string;
  rol_id: number;
  grupo_id?: number | null;
  centro_juvenil?: CentroJuvenil;
  seccion?: Seccion[];
  edad?: number;
  sexo?: Sexo;
  birthday?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: Talla;
}

// ============================================
// UPDATE USER REQUEST
// ============================================
export type UpdateUserRequest = Partial<UserFormData>;
