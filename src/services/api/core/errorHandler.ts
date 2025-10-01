import { AxiosError } from 'axios';
import { ApiError } from '../../../types/api.types.ts';
import { IS_DEVELOPMENT } from '../config/apiConfig';
import { TokenManager } from '../../auth/tokenManager';

export class ErrorHandler {
  static handleError(error: AxiosError): ApiError {
    if (!error.response) {
      return {
        message: import.meta.env.MODE === 'localhost'
          ? 'Error de conexión. ¿Está corriendo la API local?'
          : 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
        details: error.message,
      };
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        return {
          message: data?.message || 'Datos inválidos',
          status,
          details: data,
        };

      case 401:
        TokenManager.clearAuth();
        return {
          message: 'No autorizado. Por favor, inicia sesión nuevamente.',
          status,
          details: data,
        };

      case 403:
        return {
          message: 'No tienes permisos para realizar esta acción.',
          status,
          details: data,
        };

      case 404:
        return {
          message: 'Recurso no encontrado.',
          status,
          details: data,
        };

      case 500:
        return {
          message: IS_DEVELOPMENT
            ? 'Error del servidor. Revisa los logs de la API.'
            : 'Error interno del servidor. Inténtalo más tarde.',
          status,
          details: data,
        };

      default:
        return {
          message: data?.message || 'Error desconocido',
          status,
          details: data,
        };
    }
  }
}
