// src/components/common/UserAvatar.tsx
import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../services/api/config/apiConfig';
import { TokenManager } from '../../services/auth/tokenManager';
import { getInitials, getAvatarColor } from '../../utils/avatarUtils';
import { avatarCache } from '../../utils/avatarCache';
import { userService } from '../../services/api/index';
import './UserAvatar.css';

interface UserAvatarProps {
  userId: number;
  nombre?: string;
  apellido?: string;
  apellido1?: string; // ✅ Añadido para compatibilidad
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  nombre,
  apellido,
  apellido1,
  size = 'medium',
  className = '',
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState<{ nombre: string; apellido: string } | null>(null);

  // ✅ Inicializar userData inmediatamente si tenemos nombre y apellido
  useEffect(() => {
    if (nombre) {
      const apellidoFinal = apellido1 || apellido || '';
      setUserData({
        nombre: nombre,
        apellido: apellidoFinal,
      });
    } else {
      // Solo cargar del servicio si NO tenemos los datos
      fetchUserData();
    }
  }, [userId, nombre, apellido, apellido1]);

  const fetchUserData = async () => {
    try {
      const user = await userService.getUserById(userId);
      const apellido1Str = user.apellido1 || '';
      const apellido2Str = user.apellido2 || '';
      const apellidoCompleto = apellido2Str
        ? `${apellido1Str} ${apellido2Str}`.trim()
        : apellido1Str;

      setUserData({
        nombre: user.nombre || 'Usuario',
        apellido: apellidoCompleto || '',
      });
    } catch (error) {
      console.error(`Error cargando datos del usuario ${userId}:`, error);
      setUserData({
        nombre: 'Usuario',
        apellido: '',
      });
    }
  };

  // ✅ Cargar avatar en segundo plano (no bloquea las iniciales)
  useEffect(() => {
    let mounted = true;

    const loadAvatar = async () => {
      // Verificar caché primero
      const cachedUrl = avatarCache.get(userId);
      if (cachedUrl && mounted) {
        setImageSrc(cachedUrl);
        setImageError(false);
        return;
      }

      const token = TokenManager.getToken();
      if (!token) {
        if (mounted) setImageError(true);
        return;
      }

      const avatarUrl = `${API_CONFIG.BASE_URL}/usuarios/${userId}/avatar`;
      try {
        const response = await fetch(avatarUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (mounted) {
          setImageSrc(objectUrl);
          setImageError(false);
          avatarCache.set(userId, objectUrl);
        }
      } catch (error) {
        if (mounted) setImageError(true);
      }
    };

    loadAvatar();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const sizeClass = {
    small: 'user-avatar--small',
    medium: 'user-avatar--medium',
    large: 'user-avatar--large',
  }[size];

  // ✅ Si no tenemos userData aún, mostrar spinner pequeño
  if (!userData) {
    return (
      <div
        className={`user-avatar ${sizeClass} ${className}`}
        style={{ backgroundColor: '#9ca3af' }}
      >
        <div className="user-avatar__spinner">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '0.8rem' }}></i>
        </div>
      </div>
    );
  }

  // ✅ Generar iniciales y color correctamente
  const initials = getInitials(userData.nombre, userData.apellido);
  const bgColor = getAvatarColor(userData.nombre);
  const primerApellido = userData.apellido ? userData.apellido.split(' ')[0] : '';
  const nombreCompleto = `${userData.nombre} ${primerApellido}`.trim();

  // ✅ Si tenemos imagen cargada y sin error, mostrarla
  if (!imageError && imageSrc) {
    return (
      <div
        className={`user-avatar ${sizeClass} ${className}`}
        title={nombreCompleto}
        style={{ backgroundColor: bgColor }}
      >
        <img
          src={imageSrc}
          alt={nombreCompleto}
          className="user-avatar__image"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // ✅ Mostrar iniciales (por defecto, mientras carga, o si hay error)
  return (
    <div
      className={`user-avatar ${sizeClass} ${className}`}
      title={nombreCompleto}
      style={{ backgroundColor: bgColor }}
    >
      <span className="user-avatar__initials">{initials}</span>
    </div>
  );
};
