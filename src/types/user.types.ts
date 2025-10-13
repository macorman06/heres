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
  centro_juvenil?: CentroJuvenil; // ✅ Usar tipo de general.types
  seccion?: Seccion[]; // ✅ Usar tipo de general.types
  sexo?: Sexo; // ✅ Usar tipo de general.types
  edad?: number;
  birthday?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: Talla; // ✅ Usar tipo de general.types
  fecha_creacion?: string;
  fecha_modificacion?: string;
  can_login?: boolean;
  ciudad?: string;
  codigo_postal?: string;
  fecha_nacimiento?: string;
  puntuacion?: number;
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
  centro_juvenil?: CentroJuvenil;
  seccion?: Seccion[];
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
