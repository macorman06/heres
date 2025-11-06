import { HttpClient } from './core/httpClient';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { GroupService } from './services/groupService';
import { MaterialsService } from './services/materialsService';
import { PruebasService } from './services/pruebasService';
import { ActividadesService } from './services/actividadesService';
import { TareasService } from './services/tareasService';

// Crear instancia única de HttpClient
const httpClient = new HttpClient();

// Crear y exportar servicios individuales
export const authService = new AuthService(httpClient);
export const userService = new UserService(httpClient);
export const groupService = new GroupService(httpClient);
export const materialsService = new MaterialsService(httpClient);
export const pruebasService = new PruebasService(httpClient);
export const actividadesService = new ActividadesService(httpClient);
export const tareasService = new TareasService(httpClient);

// Exportar objeto API completo (opcional, para uso alternativo)
export const api = {
  auth: authService,
  user: userService,
  group: groupService,
  materials: materialsService,
  pruebas: pruebasService,
  actividades: actividadesService,
  tareas: tareasService,
};

// Exportar tipos existentes
export type { Grupo, GrupoFormData, UpdateGrupoRequest } from '../../types/group.types';
export type {
  Material,
  MaterialFilters,
  MaterialFormData,
  SearchResponse,
} from './services/materialsService';
export type { Prueba, PruebaFormData } from '../../types/prueba.types';

// Exportar nuevos tipos de actividades y tareas
export type {
  Actividad,
  CreateActividadDTO,
  ActividadFilters,
} from './services/actividadesService';

export type {
  Tarea,
  CreateTareaDTO,
  TareaFilters,
  TareaStats,
  Comentario,
  CambioEstado,
} from './services/tareasService';

// Exportar las clases de servicio
export { AuthService } from './services/authService';
export { UserService } from './services/userService';
export { GroupService } from './services/groupService';
export { MaterialsService } from './services/materialsService';
export { PruebasService } from './services/pruebasService';
export { ActividadesService } from './services/actividadesService';
export { TareasService } from './services/tareasService';
