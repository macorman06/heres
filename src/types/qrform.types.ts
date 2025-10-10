export interface FormDataQRMember {
  firstName: string;
  lastName1: string;
  lastName2: string;
  email: string;
  username: string;
  birthDate: string;
  grupo: string;
  seccion: string;
  centro_juvenil: string;
}

export interface FormErrorsQRMember {
  firstName?: string;
  lastName1?: string;
  lastName2?: string;
  email?: string;
  username?: string;
  birthDate?: string;
  grupo?: string;
  seccion?: string;
  consent?: string;
  centro_juvenil?: string;
}

export const centroJuvenilOptions = [
  { label: 'CJ Juveliber', value: 'CJ Juveliber' },
  { label: 'CJ La Balsa', value: 'CJ La Balsa' },
  { label: 'CJ Sotojoven', value: 'CJ Sotojoven' },
];
