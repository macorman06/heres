// src/pages/LoginPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
