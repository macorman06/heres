export interface Member {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  centro_juvenil: string;
  seccion: string;
  edad: number;
  sexo: 'M' | 'F';
  direccion?: string;
  localidad?: string;
  telefono?: string;
  email_contacto?: string;
  alergias?: string[];
  talla?: string;
}

export interface CreateMemberRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  centro_juvenil: string;
  seccion: string;
  edad: number;
  sexo: 'M' | 'F';
  direccion?: string;
  localidad?: string;
  telefono?: string;
  email_contacto?: string;
  alergias?: string[];
  talla?: string;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  id: number;
}
