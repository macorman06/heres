export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface User {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email: string;
  rol_id: number;
  rol: string;
  seccion?: string[];
  sexo?: 'M' | 'F';
  edad?: number;
  direccion?: string;
  localidad?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  telefono?: string;
}
