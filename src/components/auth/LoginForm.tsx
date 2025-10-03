// src/components/auth/LoginForm.tsx
import React, { useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useAuth } from '../../hooks/useAuth';
import { ToastContext } from '../../App';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode] = useState(false);
  const [nombre, setNombre] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { login, register, isLoading, error, clearError } = useAuth();
  const toastRef = useContext(ToastContext);

  useEffect(() => {
    clearError();
  }, [isRegisterMode, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password || (isRegisterMode && !nombre)) {
      return;
    }

    // Activar el spinner local
    setLocalLoading(true);
    const startTime = Date.now();

    try {
      if (isRegisterMode) {
        await register({ nombre, email, password });
      } else {
        await login({ email, password });
      }
    } catch (err: unknown) {
      if (err?.status === 0 || err?.message?.includes('conexión')) {
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Fallo en la conexión con el servidor',
          detail: 'Inténtelo de nuevo en unos minutos o contacte con el administrador',
          life: 5000,
        });
      }
    } finally {
      // Calcular tiempo transcurrido
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 3000; // 3 segundos mínimo
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      // Esperar el tiempo restante antes de ocultar el spinner
      setTimeout(() => {
        setLocalLoading(false);
      }, remainingTime);
    }
  };

  // Combinar loading del contexto y local
  const showLoading = isLoading || localLoading;

  return (
    <div className="login-form-wrapper">
      <Card className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logos/favicon-96x96.png" alt="HERES Logo" className="app-logo" />
          </div>
          <h1 className="login-title">HERES</h1>
          <p className="login-subtitle">Herramienta de Recursos Salesianos</p>
        </div>

        {error && !error.includes('conexión') && (
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
                disabled={showLoading}
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
              disabled={showLoading}
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
              disabled={showLoading}
            />
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              className={`login-button ${showLoading ? 'login-button-loading' : ''}`}
              disabled={showLoading}
            >
              {showLoading ? (
                <>
                  <i className="pi pi-spinner spinner-icon"></i>
                  <span style={{ marginLeft: '8px' }}>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <i className="pi pi-sign-in" style={{ marginRight: '8px' }}></i>
                  {isRegisterMode ? 'Registrarse' : 'Iniciar Sesión'}
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="login-footer">
          <p className="login-help">¿Problemas para acceder? Contacta al administrador.</p>
        </div>
      </Card>
    </div>
  );
};
