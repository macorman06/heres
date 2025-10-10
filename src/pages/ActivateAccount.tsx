// src/pages/ActivateAccount.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const ActivateAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState('');

  // ✅ Función para prevenir copiar/pegar
  const preventCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    return false;
  };

  const validateForm = (): boolean => {
    if (!password) {
      setError('La contraseña es obligatoria');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/activate/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al activar la cuenta');
      }

      setSuccess(true);
      setUsername(data.username);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-background">
          <div className="login-overlay">
            <div className="login-container">
              <Card className="login-card">
                <div className="login-header">
                  <div className="login-logo">
                    <i
                      className="pi pi-check-circle"
                      style={{ fontSize: '4rem', color: '#22c55e' }}
                    />
                  </div>
                  <h1 className="login-title">¡Cuenta Activada!</h1>
                  <p className="login-subtitle">Ya puedes acceder a HERES</p>
                </div>

                <div className="success-content" style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#1f2937' }}>
                    Tu cuenta ha sido activada correctamente.
                  </p>
                  <p
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#ef4444',
                      marginBottom: '20px',
                    }}
                  >
                    Usuario: {username}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '20px' }}>
                    Redirigiendo al inicio de sesión...
                  </p>
                  <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay">
          <div className="login-container">
            <Card className="login-card">
              <div className="login-header">
                <div className="login-logo">
                  <img src="/logos/favicon-96x96.png" alt="HERES Logo" className="app-logo" />
                </div>
                <h1 className="login-title">Activa tu Cuenta</h1>
                <p className="login-subtitle">Crea una contraseña para acceder a HERES</p>
              </div>

              {error && (
                <div className="login-error">
                  <Message severity="error" text={error} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                <div className="form-field">
                  <label htmlFor="password">Contraseña</label>
                  <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    toggleMask
                    feedback={true}
                    disabled={loading}
                    required
                    // ✅ Deshabilitar autocompletado
                    autoComplete="new-password"
                    inputProps={{
                      // ✅ Prevenir copiar/pegar/arrastrar
                      onCopy: preventCopyPaste,
                      onCut: preventCopyPaste,
                      onPaste: preventCopyPaste,
                      onDrag: (e: React.DragEvent) => e.preventDefault(),
                      onDrop: (e: React.DragEvent) => e.preventDefault(),
                      // ✅ Deshabilitar autocompletado más agresivamente
                      'data-lpignore': 'true',
                      'data-form-type': 'other',
                    }}
                  />
                  <small className="form-hint">Debe tener al menos 6 caracteres</small>
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    toggleMask
                    feedback={false}
                    disabled={loading}
                    required
                    // ✅ Deshabilitar autocompletado
                    autoComplete="new-password"
                    inputProps={{
                      // ✅ Prevenir copiar/pegar/arrastrar
                      onCopy: preventCopyPaste,
                      onCut: preventCopyPaste,
                      onPaste: preventCopyPaste,
                      onDrag: (e: React.DragEvent) => e.preventDefault(),
                      onDrop: (e: React.DragEvent) => e.preventDefault(),
                      // ✅ Deshabilitar autocompletado más agresivamente
                      'data-lpignore': 'true',
                      'data-form-type': 'other',
                    }}
                  />
                </div>

                <div className="form-actions">
                  <Button type="submit" className="login-button" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="pi pi-spinner spinner-icon"></i>
                        <span style={{ marginLeft: '8px' }}>Activando cuenta...</span>
                      </>
                    ) : (
                      <>
                        <i className="pi pi-check" style={{ marginRight: '8px' }}></i>
                        Activar Cuenta
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="login-footer">
                <p className="login-help">
                  ¿Ya tienes cuenta?{' '}
                  <a
                    href="/login"
                    style={{ color: '#ef4444', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
