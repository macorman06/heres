// src/pages/LoginPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Mostrar formulario de login con fondo
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay">
          <div className="login-container">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
