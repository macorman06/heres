import { AxiosError } from 'axios';
import { ApiError } from '../../../types';
import { IS_DEVELOPMENT } from '../config/apiConfig';
import { TokenManager } from '../../auth/tokenManager';

export class ErrorHandler {
  static handleError(error: AxiosError): ApiError {
    console.log('⚠️ [ErrorHandler] Procesando error:', error);

    if (!error.response) {
      console.error('❌ [ErrorHandler] Error sin respuesta (posible error de red)');
      return {
        message:
          import.meta.env.MODE === 'localhost'
            ? 'Error de conexión. ¿Está corriendo la API local?'
            : 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      };
    }

    const status = error.response.status;
    const data = error.response.data as never;

    console.log('⚠️ [ErrorHandler] Error HTTP:', { status, data });

    switch (status) {
      case 400:
        console.log('⚠️ [ErrorHandler] 400 Bad Request');
        return {
          message: 'Datos inválidos',
          status,
          details: data,
        };

      case 401:
        console.log('🔴 [ErrorHandler] 401 Unauthorized - Limpiando auth');
        TokenManager.clearAuth();
        return {
          message: 'No autorizado. Por favor, inicia sesión nuevamente.',
          status,
          details: data,
        };

      case 403:
        console.log('⚠️ [ErrorHandler] 403 Forbidden');
        return {
          message: 'No tienes permisos para realizar esta acción.',
          status,
          details: data,
        };

      case 404:
        console.log('⚠️ [ErrorHandler] 404 Not Found');
        return {
          message: 'Recurso no encontrado.',
          status,
          details: data,
        };

      case 500:
        console.log('❌ [ErrorHandler] 500 Internal Server Error');
        return {
          message: IS_DEVELOPMENT
            ? 'Error del servidor. Revisa los logs de la API.'
            : 'Error interno del servidor. Inténtalo más tarde.',
          status,
          details: data,
        };

      default:
        console.log('⚠️ [ErrorHandler] Error desconocido:', status);
        return {
          message: 'Error desconocido',
          status,
          details: data,
        };
    }
  }
}
