// ============================================
// OPCIONES DE CENTRO JUVENIL
// ============================================
export const centroJuvenilOptions = [
  { label: 'CJ Juveliber', value: 'CJ Juveliber' },
  { label: 'CJ La Balsa', value: 'CJ La Balsa' },
  { label: 'CJ Sotojoven', value: 'CJ Sotojoven' },
];

// ============================================
// OPCIONES DE SECCIÓN
// ============================================
export const seccionOptions = [
  { label: 'CJ', value: 'CJ' },
  { label: 'Chiqui', value: 'Chiqui' },
];

// ============================================
// OPCIONES DE GRUPO POR SECCIÓN
// ============================================
export const grupoOptionsBySección = {
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

// ============================================
// TIPOS DE OPCIONES
// ============================================
export interface SelectOption {
  label: string;
  value: string;
}

export type CentroJuvenil = 'CJ Juveliber' | 'CJ La Balsa' | 'CJ Sotojoven';
export type Seccion = 'CJ' | 'Chiqui';
export type GrupoCJ = 'PREAS' | 'A1' | 'A2' | 'J1' | 'J2' | 'J3' | 'Animador/a';
export type GrupoChiqui = '1º y 2º' | '3º' | '4º' | '5º' | '6º' | 'Animador/a';
