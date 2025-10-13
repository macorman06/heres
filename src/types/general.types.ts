// src/types/general.types.ts
// ============================================
// TIPOS Y OPCIONES GENERALES DE LA APLICACIÓN
// ============================================

// ============================================
// INTERFACE GENÉRICA PARA OPCIONES
// ============================================
export interface SelectOption {
  label: string;
  value: string;
}

// ============================================
// CENTRO JUVENIL
// ============================================
export type CentroJuvenil = 'CJ Juveliber' | 'CJ La Balsa' | 'CJ Sotojoven';

export const CENTROS_JUVENILES: CentroJuvenil[] = ['CJ Juveliber', 'CJ La Balsa', 'CJ Sotojoven'];

export const centroJuvenilOptions: SelectOption[] = [
  { label: 'CJ Juveliber', value: 'CJ Juveliber' },
  { label: 'CJ La Balsa', value: 'CJ La Balsa' },
  { label: 'CJ Sotojoven', value: 'CJ Sotojoven' },
];

// ============================================
// SECCIÓN
// ============================================
export type Seccion = 'CJ' | 'Chiqui';

export const SECCIONES: Seccion[] = ['CJ', 'Chiqui'];

export const seccionOptions: SelectOption[] = [
  { label: 'CJ', value: 'CJ' },
  { label: 'Chiqui', value: 'Chiqui' },
];

// ============================================
// GRUPOS
// ============================================
export type GrupoCJ = 'PREAS' | 'A1' | 'A2' | 'J1' | 'J2' | 'J3' | 'Animador/a';
export type GrupoChiqui = '1º y 2º' | '3º' | '4º' | '5º' | '6º' | 'Animador/a';

export const grupoOptionsBySección: Record<Seccion, SelectOption[]> = {
  CJ: [
    { label: 'PREAS', value: 'PREAS' },
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'J1', value: 'J1' },
    { label: 'J2', value: 'J2' },
    { label: 'J3', value: 'J3' },
    { label: 'Animador/a', value: 'Animador/a' },
  ],
  Chiqui: [
    { label: '1º y 2º', value: '1º y 2º' },
    { label: '3º', value: '3º' },
    { label: '4º', value: '4º' },
    { label: '5º', value: '5º' },
    { label: '6º', value: '6º' },
    { label: 'Animador/a', value: 'Animador/a' },
  ],
};

// Opciones de grupo consolidadas (todos los grupos)
export const grupoOptions: SelectOption[] = [
  // Grupos CJ
  { label: 'PREAS', value: 'PREAS' },
  { label: 'A1', value: 'A1' },
  { label: 'A2', value: 'A2' },
  { label: 'J1', value: 'J1' },
  { label: 'J2', value: 'J2' },
  { label: 'J3', value: 'J3' },
  // Grupos Chiqui
  { label: '1º y 2º', value: '1º y 2º' },
  { label: '3º', value: '3º' },
  { label: '4º', value: '4º' },
  { label: '5º', value: '5º' },
  { label: '6º', value: '6º' },
  // Común
  { label: 'Animador/a', value: 'Animador/a' },
];

// ============================================
// SEXO
// ============================================
export type Sexo = 'M' | 'F' | 'O';

export const sexoOptions: SelectOption[] = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
  { label: 'Otro', value: 'O' },
];

// ============================================
// TALLA
// ============================================
export type Talla = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export const TALLAS: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const tallaOptions: SelectOption[] = [
  { label: 'Extra pequeña (XS)', value: 'XS' },
  { label: 'Pequeña (S)', value: 'S' },
  { label: 'Mediana (M)', value: 'M' },
  { label: 'Grande (L)', value: 'L' },
  { label: 'Extra grande (XL)', value: 'XL' },
  { label: 'Doble extra grande (XXL)', value: 'XXL' },
];
