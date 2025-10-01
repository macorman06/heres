// src/pages/index.ts
// ============================================
// PÁGINAS PRINCIPALES
// ============================================
export { Dashboard } from './Dashboard';
export { LoginPage } from './LoginPage';
export { Members } from './Members';
export { Activities } from './Activities';
export { Contact } from './Contact';
export { AboutPage } from './AboutPage';
export { ProfilePage } from './ProfilePage';
export { Grupos } from './Grupos'
// ============================================
// MATERIALES - PÁGINA PRINCIPAL
// ============================================
export { Materials } from './Materials';

// ============================================
// MATERIALES - TODAS LAS SUBCATEGORÍAS
// ============================================
// Esto importa automáticamente todas las páginas
// de grupos-formativos, talleres, juegos, etc.
export * from './materials/index.ts';
