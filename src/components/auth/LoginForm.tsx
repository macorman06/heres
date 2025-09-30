// src/components/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode] = useState(false);
  const [nombre, setNombre] = useState('');

  const { login, register, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    // Clear error when switching modes
    clearError();
  }, [isRegisterMode, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password || (isRegisterMode && !nombre)) {
      return;
    }

    try {
      if (isRegisterMode) {
        await register({ nombre, email, password });
      } else {
        await login({ email, password });
      }
    } catch {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="login-form-wrapper">
      <Card className="login-card">
        <div className="login-header">
          {/* ✅ LOGO DE LA APP */}
          <div className="login-logo">
            <img
              src="/logos/favicon-96x96.png"
              alt="HERES Logo"
              className="app-logo"
            />
          </div>
          <h1 className="login-title">HERES</h1>
          <p className="login-subtitle">Herramienta de Recursos Salesianos</p>
        </div>

        {error && (
          <div className="login-error">
            <Message severity="error" text={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegisterMode && (
            <div className="form-field">
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                required={isRegisterMode}
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              feedback={false}
              toggleMask
              required
            />
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              label={isRegisterMode ? 'Registrarse' : 'Iniciar Sesión'}
              loading={isLoading}
              className="login-button"
            />
          </div>
        </form>

        <div className="login-footer">
          <p className="login-help">
            ¿Problemas para acceder? Contacta al administrador.
          </p>
        </div>
      </Card>
    </div>
  );
};
