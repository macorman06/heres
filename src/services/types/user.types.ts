// User role definitions
export const ROLES = {
  SUPERUSER: 1,
  DIRECTOR: 2,
  COORDINADOR: 3,
  ANIMADOR: 4,
  MIEMBRO: 5
} as const;

export type RoleId = typeof ROLES[keyof typeof ROLES];

// User type - Updated for flexible users with birthday
export interface User {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string; // Optional for users without login capability
  rol_id: number;
  rol: string;
  centro_juvenil?: string;
  seccion?: string[];
  sexo?: 'M' | 'F';
  edad?: number; // Calculated from birthday
  birthday?: string; // ✅ Added birthday field (YYYY-MM-DD format)
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  fecha_creacion?: string;
  fecha_modificacion?: string;
  can_login?: boolean; // Indicates if user has login credentials
}

// Create User Request type - also needs birthday
export interface CreateUserRequest {
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  password?: string;
  rol_id: number;
  centro_juvenil?: string;
  seccion?: string[];
  sexo?: 'M' | 'F';
  birthday?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

// Update User Request type
export type UpdateUserRequest = Partial<CreateUserRequest>
