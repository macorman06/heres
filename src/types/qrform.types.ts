export interface FormDataQRMember {
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  grupo: string;
  seccion: string;
}

export interface FormErrorsQRMember {
  firstName?: string;
  lastName?: string;
  username?: string;
  birthDate?: string;
  grupo?: string;
  seccion?: string;
  consent?: string;
}
